'use strict';
//==============================REQUIRES======================
const {
  Router
} = require('express');
const {
  v1Router
} = require('./v1');
const {
  AuthMiddleware
} = require('../../middlewares');

const apiRouter =  Router();


//==============================ROUTES=========================
apiRouter
  .use('/v1', AuthMiddleware, v1Router);


//============================MAIN EXPORT======================
module.exports = {
  apiRouter
};