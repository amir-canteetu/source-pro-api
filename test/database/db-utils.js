const getKnexInstance = require("../../db/knex.js");

// Singleton to manage test database
class TestDatabase {
  constructor() {
    this.knex = getKnexInstance("test");
  }

  async migrate() {
    await this.knex.migrate.latest();
  }

  async seed() {
    await this.knex.seed.run();
  }

  async truncate() {
    const tables = await this.knex.migrate.list();
    for (const table of tables.completed.reverse()) {
      await this.knex.raw(`TRUNCATE TABLE ${table}`);
    }
  }

  async close() {
    await this.knex.destroy();
  }
}

module.exports.testDb = new TestDatabase();
