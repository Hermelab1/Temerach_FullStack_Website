module.exports = (sequelize, DataTypes) => {

  const PermissionActions = sequelize.define(
    "permissionaction",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      action: {
        type: DataTypes.STRING(20),
        allowNull: false
      }
    },
    {
      tableName: "permissionactions",
      timestamps: true
    }
  );

  PermissionActions.associate = (models) => {
    PermissionActions.hasMany(models.modulepermission, {
      foreignKey: "permissionActionId",
      as: "modules"
    });
  };

  return PermissionActions;
};