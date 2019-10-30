'use strict';
//==============================REQUIRES======================
const {
  Router
} = require('express');
const {
  profileController
} = require('./../../../controllers');

const profileRouter = Router();



//==============================ROUTES=========================
profileRouter
  .get('/', profileController.get)
  .put('/', profileController.put);

//============================MAIN EXPORT======================
module.exports = {
  profileRouter
};