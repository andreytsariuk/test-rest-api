'use strict';
//==============================REQUIRES======================
const {
  Router
} = require('express');

const profileRouter = new Router('profile');




//==============================ROUTES=========================
// just to show folder structure
profileRouter
  .get('/', (req, res, next) => res.status(200).send('done'));


//============================MAIN EXPORT======================
module.exports = {
  profileRouter
};