module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    'roles_permissions',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      RoleId: { type: DataTypes.INTEGER, allowNull: false },
      Endpoint: { type: DataTypes.STRING, allowNull: false },
      HttpMethod: { type: DataTypes.STRING(10), allowNull: false } // GET, POST, PUT, DELETE
    },
    {
      tableName: 'roles_permissions',
      timestamps: false
    }
  );

  RolePermission.associate = (models) => {
    RolePermission.belongsTo(models.secrole, { foreignKey: 'RoleId', as: 'role' });
  };

  return RolePermission;
};
