const express = require('express');
const router = express.Router();
const db = require('./db');
const { body, validationResult } = require('express-validator');
const { verifyToken, hasPermission } = require('../middleware/auth');

// Get All Orders
router.get('/orders', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('SELECT * FROM orders');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to retrieve orders', error });
    } finally {
        if (connection) connection.release();
    }
});

// Add New Order
// Add New Order
router.post('/addorder',
    body('orderedBy').not().isEmpty().withMessage('Ordered by is required!'),
    body('companyName').not().isEmpty().withMessage('Company name is required!'),
    body('website').not().isEmpty().withMessage('Website is required!'),
    body('email').not().isEmpty().isEmail().withMessage('Email must be valid!'),
    body('phone').not().isEmpty().withMessage('Phone number is required!'),
    body('deliveryAddress').not().isEmpty().withMessage('Delivery Address is required!'),
    body('quantity').not().isEmpty().isNumeric().withMessage('Quantity must be a number!'),
    body('agreewithterms').isBoolean().withMessage('Agree with terms must be a boolean value!'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { orderedBy, companyName, website, email, phone, deliveryAddress, coffeeGrade, quantity, orderDate, status, agreewithterms } = req.body;

        let connection;
        try {
            connection = await db.getConnection();

            // Get the latest orderId, assuming orderId follows the "ORD" prefix and a numeric part
            const [rows] = await connection.query('SELECT orderId FROM orders ORDER BY orderId DESC LIMIT 1');
            let newOrderId = 'ORD0000000'; // Default to the first order id
            if (rows.length > 0) {
                const lastOrderId = rows[0].orderId;
                const lastNumber = parseInt(lastOrderId.slice(3)); // Get the numeric part
                newOrderId = 'ORD' + (lastNumber + 1).toString().padStart(7, '0'); // Increment and pad the number
            }

            // Insert the new order with the generated orderId
            const [result] = await connection.query(
                'INSERT INTO orders (orderId, orderedBy, companyName, website, email, phone, deliveryAddress, coffeeGrade, quantity, orderDate, status, agreewithterms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [newOrderId, orderedBy, companyName, website, email, phone, deliveryAddress, coffeeGrade, quantity, orderDate, status, agreewithterms]
            );

            // Get io instance from app
            const io = req.app.get("socketio");

            // Emit new order event to notify the admin
            io.emit("newOrder", { orderedBy, coffeeGrade, quantity });

            res.status(201).json({ message: 'Order created successfully!', id: result.insertId, orderId: newOrderId });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ message: 'Failed to create order', error });
        } finally {
            if (connection) connection.release();
        }
    }
);


// Update Existing Order
router.put('/updateorder/:id',
    verifyToken,
    hasPermission,
    body('status').optional().isBoolean().withMessage('Status must be a boolean value!'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { status } = req.body;

        let connection;
        try {
            connection = await db.getConnection();
            const sql = `UPDATE orders SET status = COALESCE(?, status) WHERE id = ?`;

            const [result] = await connection.query(sql, [
                status, id
            ]);

            if (result.affectedRows > 0) {
                res.json({ message: 'Order status updated' });
            } else {
                res.status(404).json({ message: 'Order not found!' });
            }
        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).json({ message: 'Failed to update order', error });
        } finally {
            if (connection) connection.release();
        }
    }
);

module.exports = router;
