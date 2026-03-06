module.exports = (sequelize, DataTypes) => {
  const Testimonial = sequelize.define(
    "Testimonial",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      designation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      companylogo: {
         type: DataTypes.STRING,
        allowNull: true,
      },
      Flag: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "testimonials",
      timestamps: true,
    }
  );

  return Testimonial;
};
