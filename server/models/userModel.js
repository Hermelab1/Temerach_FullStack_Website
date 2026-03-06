module.exports = (sequelize, DataTypes) => {
  const SecUser = sequelize.define(
    'secuser',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false }, // bcrypt hash can be long
      email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      roleId: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
      tableName: 'secusers',
      timestamps: true
    }
  );

  SecUser.associate = (models) => {
    SecUser.belongsTo(models.secrole, { foreignKey: 'roleId', as: 'role' });
  };

  return SecUser;
};
