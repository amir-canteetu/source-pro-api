const knex = require("knex");
const knexConfig = require("../knexfile.js");

const getKnexInstance = (env = "development") => {
  const connectionConfig = knexConfig[env];
  return knex(connectionConfig);
};

module.exports = getKnexInstance;
