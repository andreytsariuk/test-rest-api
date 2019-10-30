'use strict';
//==============================REQUIRES======================
const {
  Router
} = require('express');
const notificationsRouter = Router();




//==============================ROUTES=========================
// just to show folder structure
notificationsRouter
  .get('/', (req, res, next) => res.status(200).send('done'));

//============================MAIN EXPORT======================
module.exports = {
  notificationsRouter
};