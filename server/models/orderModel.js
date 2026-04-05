module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      orderNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      customerName: { type: DataTypes.STRING(255), allowNull: false },
      customerEmail: { type: DataTypes.STRING(255), allowNull: false },
      companyName: { type: DataTypes.STRING(255) },
      website: { type: DataTypes.STRING(255) },
      phone: { type: DataTypes.STRING(50) },
      deliveryAddress: { type: DataTypes.TEXT, allowNull: false },
      totalAmount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
      orderDate: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
      status: { type: DataTypes.STRING(50), defaultValue: "Ordered" },
      isPaid: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: "orders",
      timestamps: true,
    }
  );

  /* 🔗 RELATIONSHIPS */
  Order.associate = (models) => {
    // Order → OrderDetails
    Order.hasMany(models.OrderDetail, {
      foreignKey: "orderId",
      as: "details",
    });

    // Order → Payments
    Order.hasMany(models.Payment, {
      foreignKey: "orderId",
      as: "payments",
    });
  };

  return Order;
};