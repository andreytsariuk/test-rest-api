exports.up = function (knex) {
  return knex.schema
    .createTable('access_tokens', function (table) {
      table.increments('id').primary();
      table.bigInteger('user_id').references('users.id').onDelete('CASCADE');
      table.string('token').notNullable().unique();
      table.string('token_type').notNullable();
      table.boolean('used').defaultTo(false);
      table.timestamp('expires_at').defaultTo(knex.raw('now() + interval \'5 hours\' ')).notNullable();

      table.timestamps(true, true);

      table.unique(['user_id', 'token', 'expires_at']);
    });

};

exports.down = function (knex) {
  return knex.schema.dropTable('access_tokens');

};

exports.config = {
  transaction: true
};