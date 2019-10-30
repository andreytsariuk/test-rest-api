'use strict';
//==============================REQUIRES======================
const {
  Router
} = require('express');
const {
  v1Router
} = require('./v1');

const authRouter =  Router();


//==============================ROUTES=========================
authRouter
  .use('/v1', v1Router);


//============================MAIN EXPORT======================
module.exports = {
  authRouter
};