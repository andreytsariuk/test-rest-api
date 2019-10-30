'use strict';

const {
  VersionsController
} = require('./version.controller');
const {
  AuthController
} = require('./auth.controller');
const {
  InvitesController
} = require('./invites.controller');
const {
  UsersController
} = require('./users.controller');
const {
  NotificationsController
} = require('./notifications.controller');
const {
  ProfilesController
} = require('./profile.controller');



module.exports = {
  versionController: new VersionsController(),
  authController: new AuthController(),
  invitesController: new InvitesController(),
  usersController: new UsersController(),
  notificationsController: new NotificationsController(),
  profileController: new ProfilesController()
};