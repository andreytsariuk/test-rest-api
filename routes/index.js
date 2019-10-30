'use strict';
//==============================REQUIRES======================
const {
  Router
} = require('express');
const {
  publicRouter
} = require('./public');
const {
  apiRouter
} = require('./api');
const {
  authRouter
} = require('./auth');

const AppRouter = Router();


//==============================ROUTES=========================
AppRouter
  .use('/public', publicRouter)
  .use('/api', apiRouter)
  .use('/auth', authRouter);


//============================MAIN EXPORT======================
module.exports = {
  AppRouter
};