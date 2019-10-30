const {
  Role
} = require('../db/models');
const Promise = require('bluebird');
const _ = require('lodash');
const {
  ROLES
} = require('../constants');
const {
  ERRORS
} = require('../constants');

module.exports = class InviteRulesHelper {



  static validate(rules) {
    if (!rules || _.isNull(rules))
      throw new Error(ERRORS.INVITE_RULES_IS_INVALID);

    //Predefined User role for any invite, if any not provided
    rules.roles = rules.roles && rules.roles.length ? rules.roles : [ROLES.BY_ID.USER];

    let rulesObject = {
      roles: []
    };

    return Promise.map(rules.roles,
      (role_id) =>
        new Role({
          id: role_id
        })
          .fetch({
            require: true
          })
          .catch(Role.NotFoundError, () => {
            throw new Error(ERRORS.INVITE_RULES_IS_INVALID);
          })
          .then(role => {
            if (ROLES.WHITE_LIST.indexOf(role.get('name')) !== -1)
              rulesObject.roles.push(role);
            else
              throw new Error(ERRORS.INVITE_RULES_IS_INVALID);
          })).then(() => ({
      valid: true,
      rulesObject
    }));
  }



  static applyRules(rulesObject, user) {
    //attach roles	
    return user.roles().attach(rulesObject.roles)
      .then(() => user.refresh({
        withRelated: ['roles']
      }))
      .then(user => user);

  }


};