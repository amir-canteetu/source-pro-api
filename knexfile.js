const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path:
    process.env.NODE_ENV === "test"
      ? path.resolve(process.cwd(), "test/", ".env.test")
      : ".env",
});

const knexConfig = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: path.resolve(process.cwd(), "db/migrations"),
      stub: path.resolve(process.cwd(), "db/migration.stub"),
    },
    seeds: {
      directory: path.resolve(process.cwd(), "db/seeds"),
    },
    debug: process.env.NODE_ENV === "development",
    asyncStackTraces: process.env.NODE_ENV === "development",
    log: {
      warn(message) {
        console.warn("Database Warning:", message);
      },
      error(message) {
        console.error("Database Error:", message);
      },
      deprecate(message) {
        console.warn("Database Deprecation:", message);
      },
    },
  },
  test: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    pool: {
      min: 1,
      max: 5,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: path.resolve(process.cwd(), "test/database/migrations"),
    },
    seeds: {
      directory: path.resolve(process.cwd(), "test/database/test-seeds"),
    },
  },
  production: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl:
        process.env.DB_SSL === "true"
          ? {
              rejectUnauthorized: true,
            }
          : false,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: path.resolve(process.cwd(), "db/migrations"),
    },

    debug: false,
  },
};

module.exports = knexConfig;
