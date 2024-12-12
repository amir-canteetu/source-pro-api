export const up = async (knex) => {
  await knex.schema.createTable("roles", (table) => {
    table.increments("role_id").primary();
    table.string("role_name").notNullable();
    table.json("permissions").nullable();
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists("roles");
};
