const mysql = require("mysql2/promise");
const fs = require("fs/promises");
const path = require("path");
const dotenv = require("dotenv");
const { exec } = require("child_process");
const util = require("util");

dotenv.config({ path: path.resolve(process.cwd(), "test/", ".env.test") });

if (process.env.NODE_ENV === "production") {
  throw new Error("Seeding should not run in production!");
}

const execPromise = util.promisify(exec);
const sqlDumpPath = path.resolve(
  process.cwd(),
  "test/database",
  "test_db_dump.sql",
);

const cleanDumpFile = async (filePath) => {
  try {
    let sqlDump = await fs.readFile(filePath, "utf8");
    sqlDump = sqlDump
      .split("\n")
      .filter((line) => !line.match(/^CREATE DATABASE|^USE /i))
      .join("\n");
    await fs.writeFile(filePath, sqlDump);
    console.log("Database dump cleaned.");
  } catch (error) {
    console.error("Error cleaning database dump:", error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log("Connected to the test database.");
    await connection.query("DROP DATABASE IF EXISTS test_db;");
    await connection.query("CREATE DATABASE test_db;");
    await connection.query("USE test_db;");
    await execPromise(
      `mysql -h ${process.env.DB_HOST} -u ${process.env.DB_USER}  -p${process.env.DB_PASSWORD} test_db < ${sqlDumpPath}`,
    );
    console.log("Database seeded successfully.");
    await connection.end();
  } catch (error) {
    console.error("Error seeding the database:", error);
    throw error;
  }
};

module.exports = { cleanDumpFile, seedDatabase };
