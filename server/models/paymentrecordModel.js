module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      paymentMethod: {
        type: DataTypes.STRING(50), // e.g., Card, Cash
        allowNull: false,
      },

      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },

      status: {
        type: DataTypes.STRING(50), // Pending, Completed, Failed
        defaultValue: "Pending",
      },

      transactionId: {
        type: DataTypes.STRING(255), // optional
        allowNull: true,
      },
    },
    {
      tableName: "payments",
      timestamps: true,
    }
  );

  return Payment;
};
