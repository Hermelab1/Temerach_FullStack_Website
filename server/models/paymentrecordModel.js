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
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: "Pending",
      },
      transactionId: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      rawResponse: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "payments",
      timestamps: true,
    }
  );

  /* 🔗 RELATIONSHIP */
  Payment.associate = (models) => {
    Payment.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "order",
    });
  };

  return Payment;
};