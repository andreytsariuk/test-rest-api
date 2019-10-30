'use strict';
//==============================REQUIRES======================
const {
  Router
} = require('express');

const {
  versionController
} = require('./../../controllers');

const versionRouter = Router();



//==============================ROUTES=========================
versionRouter.get('/', (req, res, next) =>  versionController.get(req, res, next));


//============================MAIN EXPORT======================
module.exports = {
  versionRouter
};