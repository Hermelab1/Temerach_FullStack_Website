module.exports = (sequelize, DataTypes) => {
  const SecRole = sequelize.define(
    'secrole',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      roleName: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      description: { type: DataTypes.STRING(255), allowNull: true }
    },
    {
      tableName: 'secroles',
      timestamps: true
    }
  );

  SecRole.associate = (models) => {
    SecRole.hasMany(models.secuser, { foreignKey: 'roleId', as: 'users' });
    SecRole.hasMany(models.roles_permissions, { foreignKey: 'RoleId', as: 'permissions' });
  };

  return SecRole;
};
