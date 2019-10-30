'use strict';


/**
 * Main Export
 */
module.exports = {
  ErrorsMiddleware: require('./errors.middleware'),
  RolesMiddleware: require('./roles.middleware'),
  AuthMiddleware: require('./auth.middleware'),
  VersionMiddleware: require('./version.middleware'),
  LoggingMiddleware: require('./logging.middleware')
};