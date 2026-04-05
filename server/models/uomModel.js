module.exports = (sequelize, DataTypes) => {
  const UOM = sequelize.define(
    "UOM",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      uomName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      uomDescription: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "uoms",
      timestamps: true,
    }
  );

  // 🔗 Relationship
  UOM.associate = (models) => {

        UOM.hasMany(models.Item, {
      foreignKey: "uomId",
      as: "items",
    });

    UOM.hasMany(models.OrderDetail, {
      foreignKey: "uomId",
      as: "orderDetails",
    });
    
  };

  return UOM;
};