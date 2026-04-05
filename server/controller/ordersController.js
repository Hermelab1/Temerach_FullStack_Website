const db = require("../models");
const Order = db.Order;
const OrderDetail = db.OrderDetail;
const Payment = db.Payment;
const sequelize = db.sequelize;
const { validationResult } = require("express-validator");

/* ================= GET ALL ORDERS ================= */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderDetail,
          as: "details",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

exports.createOrder = async (req, res) => {
  // Start a transaction to ensure data integrity
  const transaction = await sequelize.transaction();

  try {
    // 1. Validate incoming request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // 2. Destructure data from request body
    const {
      customerName,
      customerEmail,
      companyName,
      website,
      phone,
      deliveryAddress,
      items, // This must be an array of items
    } = req.body;

    // 3. Generate Order Number (ORD000000X)
    const lastOrder = await Order.findOne({ order: [["id", "DESC"]] });
    let newOrderNumber = "ORD0000001";
    if (lastOrder && lastOrder.orderNumber) {
      const lastNum = parseInt(lastOrder.orderNumber.replace("ORD", ""));
      newOrderNumber = "ORD" + (lastNum + 1).toString().padStart(7, "0");
    }

    // 4. Create the Header (Order Table)
    // We calculate the totalAmount on the fly for security
    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += parseFloat(item.quantity) * parseFloat(item.unitprice);
    });

    const orderHeader = await Order.create({
      orderNumber: newOrderNumber,
      customerName,
      customerEmail,
      companyName,
      website,
      phone,
      deliveryAddress,
      totalAmount,
      status: "Ordered",
      isPaid: false
    }, { transaction });

    // 5. Create the Details (OrderDetail Table)
    // We map the items and inject the newly created orderHeader.id
    const detailsData = items.map((item) => ({
      orderId: orderHeader.id, // Linking to the Header
      itemId: item.itemId,
      categoryId: item.categoryId,
      uomId: item.uomId,
      quantity: item.quantity,
      unitprice: item.unitprice,
      totalprice: parseFloat(item.quantity) * parseFloat(item.unitprice)
    }));

    await OrderDetail.bulkCreate(detailsData, { transaction });

    // 6. Commit the transaction
    await transaction.commit();

    // 7. Emit Socket Event (Optional)
    const io = req.app.get("socketio");
    if (io) io.emit("newOrder", { customerName, orderNumber: newOrderNumber });

    return res.status(201).json({
      success: true,
      message: "Order and details saved successfully!",
      orderId: orderHeader.id,
      orderNumber: newOrderNumber
    });

  } catch (error) {
    // If anything fails, undo all database changes
    if (transaction) await transaction.rollback();
    console.error("Order Creation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
};

/* ================= UPDATE ORDER STATUS ================= */
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found!",
      });
    }

    await order.update({ status });

    res.json({
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order",
      error: error.message,
    });
  }
};

/* ================= CYBERSOURCE CALLBACK ================= */
exports.handleCyberSourceCallback = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const data = req.body;

    const orderNumber = data.req_reference_number;
    const decision = data.decision;
    const transactionId = data.transaction_id;
    const amount = data.auth_amount;

    const order = await Order.findOne({
      where: { orderNumber }
    });

    if (!order) {
      await t.rollback();
      return res.status(404).send("Order not found");
    }

    let paymentStatus = "Pending";
    let orderStatus = "Pending";
    let isPaid = false;

    // 🔥 HANDLE ALL CASES
    switch (decision) {
      case "ACCEPT":
        paymentStatus = "Completed";
        orderStatus = "Paid";
        isPaid = true;
        break;

      case "REVIEW":
        paymentStatus = "Pending";
        orderStatus = "Pending";
        isPaid = false;
        break;

      case "REJECT":
      case "DECLINE":
      case "ERROR":
        paymentStatus = "Cancelled";
        orderStatus = "Cancelled";
        isPaid = false;
        break;

      default:
        paymentStatus = "Pending";
        orderStatus = "Pending";
        isPaid = false;
    }

    // 🔹 UPDATE ORDER
    await order.update(
      {
        status: orderStatus,
        isPaid: isPaid
      },
      { transaction: t }
    );

    // 🔹 SAVE PAYMENT RECORD
    await Payment.create(
      {
        orderId: order.id,
        paymentMethod: "Card (CyberSource)",
        amount: amount || order.totalAmount,
        status: paymentStatus,
        transactionId: transactionId,
        rawResponse: JSON.stringify(data),
      },
      { transaction: t }
    );

    await t.commit();

    // 🔹 REDIRECT BASED ON RESULT
    if (decision === "ACCEPT") {
      return res.redirect(
        `http://localhost:3000/payment-success?order=${orderNumber}&amt=${amount}`
      );
    } else if (decision === "REVIEW") {
      return res.redirect(
        `http://localhost:3000/payment-pending?order=${orderNumber}`
      );
    } else {
      return res.redirect(
        `http://localhost:3000/payment-failed?order=${orderNumber}&reason=${decision}`
      );
    }

  } catch (error) {
    if (t) await t.rollback();
    console.error("Callback Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

/* ================= GET ALL PAYMENTS (ADMIN) ================= */
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Order,
          as: "order", // 👈 THIS IS THE FIX: It must match the 'as' in your Payment model association
          attributes: ['orderNumber', 'customerName', 'customerEmail'],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};