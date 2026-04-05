module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },

      categoryDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      subCategory: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "categories",
      timestamps: true,
    }
  );

  // Relationship
  Category.associate = (models) => {
    Category.hasMany(models.OrderDetail, {
      foreignKey: "categoryId",
      as: "orderDetails",
    });
      Category.hasMany(models.ItemPriceLevel, {
    foreignKey: "categoryId",
    as: "priceLevels",
  });
  };


  return Category;
};