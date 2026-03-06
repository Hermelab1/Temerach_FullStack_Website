const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create database if not exists
async function createDatabaseIfNotExists() {
  try {
    const con = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    await con.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log(`✅ Database ${process.env.DB_NAME} checked/created.`);
    await con.end();
  } catch (error) {
    console.error("❌ Failed to check/create database:", error);
    throw error;
  }
}

// Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT.toLowerCase(),
    port: process.env.DB_PORT,
    logging: false,
  }
);

module.exports = {
  sequelize,
  createDatabaseIfNotExists,
};
