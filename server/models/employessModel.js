module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      position: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      memo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      profileImage: {
        type: DataTypes.STRING(255), // path to the uploaded image
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "employees",
      timestamps: true,
    }
  );

  return Employee;
};
