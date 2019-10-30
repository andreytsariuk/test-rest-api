const moment = require('moment');
const {
  PasswordsHelper,
  InsertOrUpdateHelper
} = require('../helpers');
const {
  ROLES,
} = require('../../constants');
const passData = PasswordsHelper.saltHashPassword('test_test');


const seedData = {
  users: [{
    id: 1,
    name: 'Test Super Admin',
    email: 'su@test.com',
    password: passData.passwordHash,
    salt: passData.salt,
    identifier: `local:su@test.com`
  },
  {
    id: 2,
    name: 'Test Admin',
    email: 'admin@test.com',
    password: passData.passwordHash,
    salt: passData.salt,
    identifier: `local:admin@test.com`
  },
  {
    id: 3,
    name: 'Test User',
    email: 'user@test.com',
    password: passData.passwordHash,
    salt: passData.salt,
    identifier: `local:user@test.com`
  }
  ],
  profiles: [{
    id: 1,
    billing_email:'su@test.com',
    terms_and_conditions_acceptance_date: moment().toISOString(),
    accepted_terms_and_conditions_id: 1,
    accepted_privacy_and_policy_id: 1,
    privacy_and_policy_acceptance_date: moment().toISOString()
  },
  {
    id: 2,
    billing_email: 'admin@test.com',
    terms_and_conditions_acceptance_date: moment().toISOString(),
    accepted_terms_and_conditions_id: 1,
    accepted_privacy_and_policy_id: 1,
    privacy_and_policy_acceptance_date: moment().toISOString()
  },
  {
    id: 3,
    billing_email: 'user@test.com',
    terms_and_conditions_acceptance_date: moment().toISOString(),
    accepted_terms_and_conditions_id: 1,
    accepted_privacy_and_policy_id: 1,
    privacy_and_policy_acceptance_date: moment().toISOString()
  }
  ],
  roles: [{
    id: 1,
    name: ROLES.SU,
    display_name: 'Super admin',
  },
  {
    id: 2,
    name: ROLES.ADMIN,
    display_name: 'Admin',
  },
  {
    id: 3,
    name: ROLES.USER,
    display_name: 'User',
  }
  ],
  users_roles: [{
    id: 1,
    user_id: 1,
    role_id: 1
  },
  {
    id: 2,
    user_id: 1,
    role_id: 2
  },
  {
    id: 3,
    user_id: 1,
    role_id: 3
  },
  {
    id: 4,
    user_id: 2,
    role_id: 2
  },
  {
    id: 5,
    user_id: 2,
    role_id: 3
  },
  {
    id: 6,
    user_id: 3,
    role_id: 3
  }]
};


function usersSeed(knex) {

  return knex('users').insert(seedData.users)
    .then(() => knex('profiles')
      .insert(seedData.profiles))
    .then(() => InsertOrUpdateHelper(knex, 'roles', seedData.roles))
    .then(() => knex('users_roles')
      .insert(seedData.users_roles));
}


module.exports = {
  data: seedData,
  seed: usersSeed
};