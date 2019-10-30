'use strict';
const {
  request, // eslint-disable-line no-unused-vars
  response // eslint-disable-line no-unused-vars
} = require('express')();
const {
  PasswordsHelper,
  SignUpHelper
} = require('../helpers');
const {
  User,
  Invite,
  AccessToken
} = require('../db/models');
const {
  EmailsService
} = require('../services');
const {
  AbstractRoutesController
} = require('../datatypes');
const {
  ERRORS
} = require('../constants');
const config = require('config');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const moment = require('moment');



class AuthController extends AbstractRoutesController {


  constructor(...params) {
    super(...params);
  }


  /**
   * Will return user object with new token and expiration time
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  signIn(req, res, next) {
    const SignIn = req.body;
    return new User({
      identifier: `local:${User.encryptPD(SignIn.email)}`
    })
      .fetch({
        require: true,
        withRelated: [
          'roles',
          'profile'
        ]
      })

      .tap(user => user.save({
        last_login: moment().toISOString()
      }))
      .tap(user => user.decryptPD(user))
      .tap(user => PasswordsHelper.checkHash(SignIn.password, user.get('password'), user.get('salt')))
      .tap(user => req.token = jwt.sign(
        user.toJSON(),
        config.get('JWT.Secret'), {
          expiresIn: `${config.get('JWT.ExpirationCount')}${config.get('JWT.ExpirationCountItem')}`
        }))
      .tap(user => res.status(200).send(this.formatResponse({
        access_token: req.token,
        expires_at: moment()
          .add(config.get('JWT.ExpirationCount'), config.get('JWT.ExpirationCountItem')),
        user
      })))
      .catch(User.NotFoundError, () => {
        throw new Error(ERRORS.INVALID_CREDENTIALS);
      })
      .catch(next);
  }


  /**
   * Main function that will route type of signUp depending on params
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  signUp(req, res, next) {
    const SignUp = req.body;
    return Promise.resolve()
      .then(() => {
        if (SignUp.invite)
          return SignUpHelper.signUpInvite(req);
        else
          // return SignUpHelper.signUpDb(req);
          throw new Error(ERRORS.INVITE_INCORRECT);
      })
      .then(signUpResult => res.status(200).send(this.formatResponse(signUpResult)))
      .catch(next);
  }


  /**
   * Will renew a token by previous active one
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  renewToken(req, res, next) {
    const newToken = jwt.sign(
      req.user.toJSON(),
      config.get('JWT.Secret'), {
        expiresIn: `${config.get('JWT.ExpirationCount')}${config.get('JWT.ExpirationCountItem')}`
      }
    );
    req.user.decryptPD(req.user);

    return res.status(200)
      .send(this.formatResponse({
        access_token: newToken,
        expires_at: moment()
          .add(config.get('JWT.ExpirationCount'), config.get('JWT.ExpirationCountItem')),
        user: req.user
      }));
  }


  /**
   * Returns invite by code
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  getInvite(req, res, next) {
    const token = req.body;
    return new Invite()
      .where({
        token
      })
      .fetch({
        require: true
      })
      .catch(Invite.NotFoundError, () => {
        throw new Error(ERRORS.INVITE_INCORRECT);
      })
      .then(invite => invite.validate())
      .then(invite => res.status(201).send(this.formatResponse(invite)))
      .catch(next);
  }


  /**
   * Sends the reset-password email to provided user
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  forgotPassword(req, res, next) {
    const ForgotPassword = req.body;
    return new User({
      identifier: `local:${User.encryptPD(ForgotPassword.email)}`
    })
      .fetch({
        require: true
      })
      .then(user => new AccessToken({
        user_id: user.id,
        token_type: config.get('TokenTypes.resetPassword')
      }).save())
      .then(token => EmailsService.sendResetPassword(ForgotPassword.email, token.get('token')))
      .then(() => res.status(200).send(this.formatResponse({
        code: 'email_send'
      })))
      .catch(User.NotFoundError, () => {
        throw new Error(ERRORS.EMAIL_DOES_NOT_EXISTS);
      })
      .catch(next);
  }


  /**
   * Just validates that token was sent is correct for viewing the 'reset-password' page
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  getResetPasswordToken(req, res, next) {
    const token = req.body;
    if (!token)
      return next(new Error(ERRORS.ACCESS_TOKEN_IS_INCORRECT));

    return new AccessToken()
      .where({
        token
      })
      .fetch({
        require: true
      })
      .catch(AccessToken.NotFoundError, () => {
        throw new Error(ERRORS.ACCESS_TOKEN_IS_INCORRECT);
      })
      .then(token => token.validate())
      .then(token => res.status(200).send(this.formatResponse(token)))
      .catch(next);
  }


  /**
   * Will reset password by reset-password token
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  resetPassword(req, res, next) {
    const ResetPassword = req.body;
    let _token;
    if (!ResetPassword.token)
      return next(new Error(ERRORS.ACCESS_TOKEN_IS_INCORRECT));


    return new AccessToken()
      .where({
        token: ResetPassword.token
      })
      .fetch({
        require: true,
        withRelated: ['user']
      })
      .catch(AccessToken.NotFoundError, () => {
        throw new Error(ERRORS.ACCESS_TOKEN_IS_INCORRECT);
      })
      .then(token => token.validate())
      .then(token => {
        _token = token;
        const passData = PasswordsHelper.saltHashPassword(ResetPassword.newPassword);
        return _token.related('user').save({
          password: passData.passwordHash,
          salt: passData.salt
        });
      })
      .then(user => user.refresh({
        withRelated: ['roles']
      }))
      .tap(user => req.token = jwt.sign(
        user.toJSON(),
        config.get('JWT.Secret'), {
          expiresIn: `${config.get('JWT.ExpirationCount')}${config.get('JWT.ExpirationCountItem')}`
        }
      ))
      .tap(user => _token.markAsUsed(user.id, config.get('TokenTypes.resetPassword')))
      .tap(user => res.status(200).send(this.formatResponse({
        access_token: req.token,
        expires_at: moment()
          .add(config.get('JWT.ExpirationCount'), config.get('JWT.ExpirationCountItem')),
        user
      })))
      .catch(next);
  }
}

module.exports = {
  AuthController
};