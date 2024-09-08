exports.up = function (knex) {
  return knex.schema.createTable("tables", (table) => {
    table.increments("table_id").primary();
    table.timestamps(true, true);
    table.string("table_name");
    table.integer("capacity");
    table.integer("reservation_id").unsigned();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tables");
};
