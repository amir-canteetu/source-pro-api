const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path:
    process.env.NODE_ENV === "test"
      ? path.resolve(process.cwd(), "test/", ".env.test")
      : ".env",
});

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
