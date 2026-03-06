module.exports = (sequelize, DataTypes) => {
  const OurTouch = sequelize.define(
    "OurTouch",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      icon: {
        type: DataTypes.STRING(255), // optional icon image/path
        allowNull: true,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "ourtouchs",
      timestamps: true,
    }
  );

  return OurTouch;
};
