
exports.up = function (knex) {

  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email')
      table.string('name');
      table.string('password');
      table.string('salt');
      table.timestamp('last_login');
      table.string('identifier').notNullable().unique();

      table.timestamps(true, true);

      table.unique(['email', 'password', 'salt']);
    })
    .createTable('roles', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.string('display_name');

      table.timestamps(true, true);
    })
    .createTable('users_roles', function (table) {
      table.increments('id').primary();
      table.bigInteger('user_id').references('users.id').notNullable().onDelete('CASCADE');
      table.bigInteger('role_id').references('roles.id').notNullable().onDelete('CASCADE');

      table.timestamps(true, true);

      table.unique(['user_id', 'role_id']);

    });
};

exports.down = function (knex, Promise) {
  return Promise
    .all([
      knex('users').del(),
    ])
    .then(() => knex.schema
      .dropTable('users_roles')
      .dropTable('users')
      .dropTable('roles')
    );
};

exports.config = {
  transaction: true
};