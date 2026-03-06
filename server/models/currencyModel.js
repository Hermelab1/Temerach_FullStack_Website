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
        unique: true, // USD, EUR, etc.
      },

      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      symbol: {
        type: DataTypes.STRING(10),
        allowNull: false, // $, €, £
      },

      rateToETB: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: false,
        defaultValue: 1.0, // Relative to USD
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
