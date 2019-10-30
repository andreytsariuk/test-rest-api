'use strict';


const config = require('config');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const {
  User,
  Invite
} = require('../db/models');
const {
  ERRORS
} = require('../constants');


/**
 * Main Export
 */
module.exports = class SignUpHelper {


  /**
   * Function will create user only depending on input data
   * @param {*} req 
   */
  static signUpDb(req) {
    const {
      PasswordsHelper
    } = require('../helpers');
    const passData = PasswordsHelper.saltHashPassword(req.body.password);

    return new User({
      email: User.encryptPD(req.body.email),
      name: req.body.name,
      password: passData.passwordHash,
      salt: passData.salt,
      identifier: `local:${User.encryptPD(req.body.email)}`
    })
      .save()
      .then(user => user.refresh({
        require: true,
        withRelated: ['roles']
      }))
      .tap(user => user.save({
        last_login: moment().toISOString()
      }))
      .tap(user => PasswordsHelper.checkHash(req.body.password, user.get('password'), user.get('salt')))
      .tap(user => req.token = jwt.sign(
        user.toJSON(),
        config.get('JWT.Secret'), {
          expiresIn: `${config.get('JWT.ExpirationCount')}${config.get('JWT.ExpirationCountItem')}`
        }))
      .then(user => ({
        access_token: req.token,
        expires_at: moment()
          .add(config.get('JWT.ExpirationCount'), config.get('JWT.ExpirationCountItem')),
        user
      }));
  }


  /**
   * Function will create user with invite rules 
   * @param {*} req
   */
  static signUpInvite(req) {
    const SignUp = req.body;
    const {
      PasswordsHelper,
      InviteRulesHelper
    } = require('../helpers');
    const passData = PasswordsHelper.saltHashPassword(SignUp.password);

    return new Invite()
      .where({
        token: SignUp.invite
      })
      .fetch({
        require: true
      })
      .catch(Invite.NotFoundError, () => {
        throw new Error(ERRORS.INVITE_INCORRECT);
      })
      .then(invite => invite.validate())
      .then(invite => req.invite = invite)
      .then(() => new User({
        email: SignUp.email,
        name: SignUp.name,
        password: passData.passwordHash,
        salt: passData.salt,
        identifier: `local:${User.encryptPD(SignUp.email)}`
      })
        .save())
      .then(user => user.refresh({
        require: true,
        withRelated: ['roles']
      }))
      .tap(user => user.save({
        last_login: moment().toISOString()
      }))
      .tap(user => InviteRulesHelper.validate(req.invite.get('rules'))
        .then(result => InviteRulesHelper.applyRules(result.rulesObject, user))
      )
      .tap(user => req.invite.markAsUsed(user.get('email')))
      .tap(user => PasswordsHelper.checkHash(SignUp.password, user.get('password'), user.get('salt')))
      .tap(user => req.token = jwt.sign(
        user.toJSON(),
        config.get('JWT.Secret'), {
          expiresIn: `${config.get('JWT.ExpirationCount')}${config.get('JWT.ExpirationCountItem')}`
        }))
      .then(user => ({
        access_token: req.token,
        expires_at: moment()
          .add(config.get('JWT.ExpirationCount'), config.get('JWT.ExpirationCountItem')),
        user
      }));
  }

};