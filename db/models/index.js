'use strict';


/**
 * Main Export
 */
module.exports = {
  User: require('./user.model'),
  Role: require('./role.model'),
  UserRole: require('./userRole.model'),
  Invite: require('./invite.model'),
  AccessToken: require('./accessToken.model'),
  Profile: require('./profile.model'),
  Notification: require('./notification.model')
};