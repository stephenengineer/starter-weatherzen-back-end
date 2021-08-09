exports.up = function (knex) {
  return knex.schema.table("observations", (table) => {
    table.decimal("air_temperature"); // Add a new column
    table.string("air_temperature_unit", 1); // Add a new column
  });
};

exports.down = function (knex) {
  return knex.schema.table("observations", (table) => {
    table.dropColumns(["air_temperature", "air_temperature_unit"]); // Remove column
    table.string("air_temperature_unit", 1); // Remove column
  });
};
