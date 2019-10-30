exports.up = function (knex) {
  return knex.schema
    .createTable('invites', function (table) {
      table.increments('id').primary();
      table.string('email');
      table.string('name');
      table.string('token').notNullable().unique();
      table.bigInteger('user_id').references('users.id').onDelete('CASCADE');
      table.boolean('used').defaultTo(false);
      table.json('rules');
      table.timestamp('expires_at').defaultTo(knex.raw('now() + interval \'5 hours\' ')).notNullable();

      table.timestamps(true, true);

      table.unique(['email', 'token', 'expires_at']);
    });

};

exports.down = function (knex) {
  return knex.schema.dropTable('invites');
};

exports.config = {
  transaction: true
};