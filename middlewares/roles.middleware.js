
const _ = require('lodash');
const {
  ERRORS
} = require('../constants');

/**
 * 
 * @param {array} roles array of needed permissions
 * @param {object} params  Params Object
 */
module.exports = (roles = []) => {
  const required_roles = roles;

  return (req, res, next) => {
    let hasRole = false;
    req.required_roles = required_roles;
    
    req.user.related('roles').map(role => {
      if (_.indexOf(required_roles, role.get('name')) !== -1) {
        hasRole = true;
      }
    });
    if (!hasRole)
      return next(new Error(ERRORS.NEEDS_PERMISSIONS));
    else
      return next();
  };

};
