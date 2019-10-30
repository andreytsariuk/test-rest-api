exports.up = function (knex) {
  return knex.schema
    .createTable('notifications', function (table) {
      table.increments('id').primary();
      table.bigInteger('user_id').references('users.id').onDelete('CASCADE');
      table.string('type').notNullable();
      table.string('recipients');

      table.timestamps(true, true);
    });

};

exports.down = function (knex) {
  return knex.schema.dropTable('notifications');
};

exports.config = {
  transaction: true
};