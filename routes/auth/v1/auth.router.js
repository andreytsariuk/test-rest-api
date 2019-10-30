'use strict';
//==============================REQUIRES======================
const {
  Router
} = require('express');
const {
  authController
} = require('./../../../controllers');
const {
  AuthMiddleware
} = require('../../../middlewares');

const authRouter = Router();



//==============================ROUTES=========================
authRouter.post('/sign-in', authController.signIn)
  .post('/sign-up', authController.signUp)
  .post('/forgot-password', authController.forgotPassword)
  .post('/reset-password', authController.resetPassword)
  .post('/token', AuthMiddleware, authController.renewToken)
  .get('/invite', authController.getInvite)
  .get('/token/reset-password', authController.getResetPasswordToken);


//============================MAIN EXPORT======================
module.exports = {
  authRouter
};