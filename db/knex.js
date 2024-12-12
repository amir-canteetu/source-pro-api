import knex from "knex";
import knexConfig from "../knexfile.js";

const getKnexInstance = (env = "development") => {
  const connectionConfig = knexConfig[env];
  return knex(connectionConfig);
};

export default getKnexInstance;
