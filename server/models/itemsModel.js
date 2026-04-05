module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define(
    "Item",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      itemName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      itemCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      uomId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      stockQty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      isTaxable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      transactionAllowed: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "items",
      timestamps: true,
    }
  );

  Item.associate = (models) => {
    Item.belongsTo(models.UOM, {
      foreignKey: "uomId",
      as: "uom",
    });
     Item.hasMany(models.ItemPriceLevel, {
    foreignKey: "itemId",
    as: "priceLevels",
  });
  };

  return Item;
};