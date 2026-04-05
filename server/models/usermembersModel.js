module.exports = (sequelize, DataTypes) => {
  const UserMember = sequelize.define(
    "usermember",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      RoleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: "usermember",
      timestamps: false
    }
  );

  UserMember.associate = (models) => {

    // Role
    UserMember.belongsTo(models.secrole, {
      foreignKey: "RoleId",
      as: "role"
    });

    // User
    UserMember.belongsTo(models.secuser, {
      foreignKey: "UserId",
      as: "user"
    });

  };

  return UserMember;
};