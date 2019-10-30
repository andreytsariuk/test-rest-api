'use strict';
//==============================REQUIRES======================
const {
  Router
} = require('express');
const {
  authRouter
} = require('./auth.router');

const v1Router =  Router();


//==============================ROUTES=========================
v1Router
  .use('/', authRouter);



//============================MAIN EXPORT======================
module.exports = {
  v1Router
};