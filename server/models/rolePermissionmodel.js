module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    "rolespermissions",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      RoleId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
      },

      PermissionId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
      }
    },
    {
      tableName: "rolespermissions",
      timestamps: false
    }
  );

  RolePermission.associate = (models) => {

    // Role
    RolePermission.belongsTo(models.secrole, {
      foreignKey: "RoleId",
      as: "role"
    });

    // Permission
    RolePermission.belongsTo(models.modulepermission, {
      foreignKey: "PermissionId",
      as: "permission"
    });

  };

  return RolePermission;
};