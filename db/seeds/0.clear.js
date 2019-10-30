const usersSeedData = require('./1.users').data;



exports.seed = function (knex) {

  // Deletes ALL existing entries
  return knex('users')
      .del()
      .whereIn('id', usersSeedData.users.map(el => el.id));
};