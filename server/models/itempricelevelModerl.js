module.exports = (sequelize, DataTypes) => {
  const ItemPriceLevel = sequelize.define(
    "ItemPriceLevel",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      unitPrice: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
    },
    {
      tableName: "itempricelevels",
      timestamps: true,
    }
  );

  // Relationships
  ItemPriceLevel.associate = (models) => {
    ItemPriceLevel.belongsTo(models.Item, {
      foreignKey: "itemId",
      as: "item",
    });

    ItemPriceLevel.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });
  };

  return ItemPriceLevel;
};