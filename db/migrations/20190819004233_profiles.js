exports.up = function (knex) {
  return knex.schema
    .createTable('profiles', (table) => {
      table.increments('id').references('users.id').notNullable().onDelete('CASCADE').primary();
      table.bigInteger('timezone').defaultTo(0).notNullable();
      table.string('timezone_name');
      table.string('billing_email');
      table.string('billing_address');
      table.timestamp('last_login');
      table.bigInteger('business_address_id').references('addresses.id').onDelete('CASCADE');

      table.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('profiles');

};

exports.config = {
  transaction: true
};