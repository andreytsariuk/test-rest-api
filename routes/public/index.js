'use strict';
//==============================REQUIRES======================
const {
  Router
} = require('express');
const {
  versionRouter
} = require('./version.router');

const publicRouter = new Router();


//==============================ROUTES=========================

publicRouter
  .use('/version', versionRouter);


//============================MAIN EXPORT======================
module.exports = {
  publicRouter
};