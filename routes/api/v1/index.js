'use strict';
//==============================REQUIRES======================
const {
  Router
} = require('express');
const {
  invitesRouter
} = require('./invites.router');
const {
  usersRouter
} = require('./users');
const {
  notificationsRouter
} = require('./notifications.router');
const {
  profileRouter
} = require('./profile.router');
const {
  RolesMiddleware
} = require('../../../middlewares');
const {
  ROLES
} = require('../../../constants');

const v1Router =  Router();


//==============================ROUTES=========================
v1Router
  .use('/invites', invitesRouter)
  .use('/users', RolesMiddleware([ROLES.ADMIN, ROLES.SU]), usersRouter)
  .use('/notifications', notificationsRouter)
  .use('/profile', profileRouter);


//============================MAIN EXPORT======================
module.exports = {
  v1Router
};