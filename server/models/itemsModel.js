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

      price: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },

      stockQty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "items",
      timestamps: true,
    }
  );

  return Item;
};
