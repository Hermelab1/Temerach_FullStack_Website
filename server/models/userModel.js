module.exports = (sequelize, DataTypes) => {
  const SecUser = sequelize.define(
    "secuser",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },

      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: "secusers",
      timestamps: true
    }
  );

  SecUser.associate = (models) => {

    // User -> UserMember
    SecUser.hasMany(models.usermember, {
      foreignKey: "UserId",
      as: "roles"
    });

  };

  return SecUser;
};