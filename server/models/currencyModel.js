module.exports = (sequelize, DataTypes) => {
  const Currency = sequelize.define(
    "Currency",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
      },

      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      symbol: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },

      rate: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: false,
        defaultValue: 1.0,
      },

      isDefault:{
        type: DataTypes.BOOLEAN,
        default:false,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "currencies",
      timestamps: true,
    }
  );

  return Currency;
};