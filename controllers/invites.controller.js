'use strict';
const {
  request, // eslint-disable-line no-unused-vars
  response // eslint-disable-line no-unused-vars
} = require('express')();
const {
  User,
  Invite
} = require('../db/models');
const {
  EmailsService
} = require('../services');
const {
  InviteRulesHelper
} = require('../helpers');
const {
  AbstractRoutesController
} = require('../datatypes');
const {
  ERRORS
} = require('../constants');
const _ = require('lodash');



class InvitesController extends AbstractRoutesController {


  constructor(...params) {
    super(...params);
  }


  /**
   * Overrides the basic method of AbstractRoutesController 
   * get all exist plans
   * Required param see in docs => routes/api/v1/plans/list
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  list(req, res, next) {
    const {page, pageSize, Search} = req.query;

    return new Invite()
      .query(qb => {
        if (Search) {
          qb.whereRaw('LOWER(to_char(id,\'999\')) LIKE ?', [`%${_.toLower(Search)}%`]);
          qb.orWhereRaw('LOWER(name) LIKE ?', [`%${_.toLower(Search)}%`]);
          qb.orWhereRaw('LOWER(email) LIKE ?', [`%${_.toLower(Search)}%`]);
        }
      })
      .orderBy('created_at', 'DESC')
      .fetchPage({
        pageSize,
        page
      })
      .then(result => res.status(200).send(this.formatResponse({
        data: result.toJSON(),
        pagination: result.pagination
      })))
      .catch(next);
  }


  /**
   * Overrides the basic method of AbstractRoutesController 
   * Creates new invite based on specific rules
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  post(req, res, next) {
    const InvitesCreate = req.body;
    return new User()
      .where({
        identifier: `local:${InvitesCreate.email}`
      })
      .fetchAll()
      .then(result => {
        if (result.models.length > 0)
          throw new Error(ERRORS.USER_ALREADY_REGISTERED);
        else
          return result;
      })
      .then(() => new Invite().markAsUsed(InvitesCreate.email))
      .then(() => InviteRulesHelper.validate(InvitesCreate.rules))
      .then(() => new Invite({
        email: InvitesCreate.email,
        name: InvitesCreate.name,
        rules: JSON.stringify(InvitesCreate.rules)
      }).save())
      .tap(invite => EmailsService.sendInvite(InvitesCreate.email, invite.get('token')))
      .tap(invite => res.status(201).send(this.formatResponse(invite)))
      .catch(next);
  }


  /**
   * Overrides the basic method of AbstractRoutesController 
   * Delete Current Plan by code
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  delete(req, res, next) {
    return req.requestedInvite.destroy()
      .then(() => res.status(200).send(this.formatResponse({
        code: 'removed'
      })))
      .catch(next);
  }


  /**
   * Overrides the basic method of AbstractRoutesController 
   * returns  Invite by provided ID
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  get(req, res, next) {
    return new Invite()
      .where({
        token: req.query.token
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
}

module.exports = {
  InvitesController
};