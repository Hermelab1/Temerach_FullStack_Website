module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define(
    "Contactus", // Changed to match your controller (db.Contactus)
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      FullName: { // Match frontend keys
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { isEmail: true },
      },
      Phone: { type: DataTypes.STRING(20), allowNull: true },
      CompanyName: { type: DataTypes.STRING(255), allowNull: true },
      Websites: { type: DataTypes.STRING(255), allowNull: true },
      Memo: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "contacts",
      timestamps: true,
    }
  );

  return Contact;
};