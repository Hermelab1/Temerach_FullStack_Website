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
        type: DataTypes.STRING, // no limit
        allowNull: false,
        unique: true,
      },

      categoryDescription: {
        type: DataTypes.TEXT, // unlimited length
        allowNull: false,
      },

      isActive: { 
        type: DataTypes.BOOLEAN, // ✅ FIXED
        allowNull: false,
        defaultValue: true // also use defaultValue instead of default
      },
    },
    {
      tableName: "categories",
      timestamps: true, // createdAt & updatedAt
    }
  );

  return Category;
};
