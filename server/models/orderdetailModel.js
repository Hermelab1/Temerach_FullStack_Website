module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define(
    "OrderDetail",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        orderId: { type: DataTypes.INTEGER, allowNull: false },
        itemId: { type: DataTypes.INTEGER, allowNull: false },
        categoryId: { type: DataTypes.INTEGER, allowNull: false },
        uomId: { type: DataTypes.INTEGER, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        unitprice: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
        totalprice: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
    },
    { tableName: "orderdetails", timestamps: true }
  );

    // 🔗 Relationships
  OrderDetail.associate = (models) => {
    OrderDetail.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "order",
    });

    OrderDetail.belongsTo(models.Item, {
      foreignKey: "itemId",
      as: "item",
    });
    OrderDetail.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });

    OrderDetail.belongsTo(models.UOM, {
      foreignKey: "uomId",
      as: "uom",
    });
  };

  return OrderDetail;
}