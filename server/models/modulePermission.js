module.exports = (sequelize, DataTypes) => {

  const ModulePermission = sequelize.define(
    "modulepermission",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      moduleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      permissionActionId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: "modulepermissions",
      timestamps: true
    }
  );

  ModulePermission.associate = (models) => {

    ModulePermission.belongsTo(models.modules, {
      foreignKey: "moduleId",
      as: "module"
    });

    ModulePermission.belongsTo(models.permissionaction, {
      foreignKey: "permissionActionId",
      as: "action"
    });

  };

  return ModulePermission;
};