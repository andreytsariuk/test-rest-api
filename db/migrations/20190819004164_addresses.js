exports.up = function (knex) {
  return knex.schema
    .createTable('addresses', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('city').notNullable();
      table.string('country').notNullable();
      table.string('geo_coordinates').notNullable();

      table.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('addresses');
};

exports.config = {
  transaction: true
};