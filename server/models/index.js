const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const { sequelize } = require("../config/db");

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== "index.js" &&
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const modelFactory = require(path.join(__dirname, file));

    // 🔍 Safety check
    if (typeof modelFactory !== "function") {
      throw new Error(
        `Model file ${file} does not export a function`
      );
    }

    const model = modelFactory(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Call associations if exist
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
