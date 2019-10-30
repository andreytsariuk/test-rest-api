const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const {
  User
} = require('../db/models');
const {
  ERRORS
} = require('../constants');

/**
 * 
 * @param {req} req 
 * @param {res} res 
 * @param {function} next 
 */
module.exports = (req, res, next) => {
  let token;
  try {
    // There may be no such objects in params
    token = _.split(req.headers.authorization.value, ' ')[1] || req.query.token;
  } catch (_) {
    return next(new Error(ERRORS.TOKEN_NOT_PROVIDED));
  }

  if (!token || token === '')
    return next(new Error(ERRORS.TOKEN_NOT_PROVIDED));
  else
    return Promise
      .fromCallback(cb => jwt.verify(token, config.get('JWT.Secret'), cb))
      .then(decoded => new User({
        id: decoded.id
      }).fetch({
        require: true,
        withRelated: [
          'roles',
          'profile'
        ]
      }))
      .then(user => req.user = user)
      .then(() => next())
      .catch(User.NotFoundError, () => {
        throw new Error(ERRORS.UNAUTHORIZED);
      })
      .catch(next);
};