'use strict';
//==============================REQUIRES======================
const {
  Router
} = require('express');
const {
  notificationsController
} = require('./../../../controllers');

const notificationsRouter = Router();



//==============================ROUTES=========================
notificationsRouter.get('/', notificationsController.list);


//============================MAIN EXPORT======================
module.exports = {
  notificationsRouter
};