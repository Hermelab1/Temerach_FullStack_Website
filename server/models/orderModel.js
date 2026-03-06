module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      orderNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      customerName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      customerEmail: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      totalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },

      status: {
        type: DataTypes.STRING(50),
        defaultValue: "Pending",
      },

      isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "orders",
      timestamps: true,
    }
  );

  return Order;
};
