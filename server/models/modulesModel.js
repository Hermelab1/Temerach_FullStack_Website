module.exports = (sequelize, DataTypes) => {

  const Modules = sequelize.define(
    "modules",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      moduleName: {
        type: DataTypes.STRING(100),
        allowNull: false
      },

      submoduleName: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      path: {
        type: DataTypes.STRING(150),
        allowNull: true
      },

      icon: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      moduleDescription: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: "modules",
      timestamps: true
    }
  );

  Modules.associate = (models) => {
    Modules.hasMany(models.modulepermission, {
      foreignKey: "moduleId",
      as: "permissions"
    });
  };

  return Modules;
};