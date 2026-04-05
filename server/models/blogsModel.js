module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "blog",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      blogcode: {
        type: DataTypes.STRING(10),
        unique: true,
        allowNull: false,
      },

      blogTitle: {
        type: DataTypes.STRING(250),
        unique: true,
        allowNull: false,
      },

      blogDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      bologdate:{
        type: DataTypes.DATE,
        allowNull: false,
      },

      mediaSrc: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      shareCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "blogs",
      timestamps: true,
    }
  );

  return Blog;
};
