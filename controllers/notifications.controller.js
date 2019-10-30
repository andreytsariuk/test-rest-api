'use strict';
const {
  request, // eslint-disable-line no-unused-vars
  response // eslint-disable-line no-unused-vars
} = require('express')();
const {
  AbstractRoutesController,
  RoleBaseInstructions
} = require('../datatypes');
const {
  Notification
} = require('../db/models');
const _ = require('lodash');

class NotificationsController extends AbstractRoutesController {


  constructor(...params) {
    super(...params);

    this.instructions = new RoleBaseInstructions()
      .add(this.constants.CONTROLLERS_METHODS.LIST, {
        and: [
          this.constants.ROLES.USER
        ]
      }, this.getNotificationsListByUser)
      .add(this.constants.CONTROLLERS_METHODS.LIST, {
        or: [
          this.constants.ROLES.SU,
          this.constants.ROLES.ADMIN
        ]
      }, this.getNotificationsListByAdmin);
  }


  /**
   * 
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  getNotificationsListByUser(req, res, next) {
    const {
      page,
      pageSize,
      search
    } = req.query;

    return new Notification()
      .query(qb => {
        qb.where('user_id', req.user.id);

        if (search) {
          qb.whereRaw('LOWER(to_char(id,\'999\')) LIKE ?', [`%${_.toLower(search)}%`]);
          qb.orWhereRaw('LOWER(type) LIKE ?', [`%${_.toLower(search)}%`]);
          qb.orWhereRaw('LOWER(recipients) LIKE ?', [`%${_.toLower(search)}%`]);
        }
      })
      .orderBy('created_at', 'desc')
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
   * 
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  getNotificationsListByAdmin(req, res, next) {
    const {
      page,
      pageSize,
      search
    } = req.query;


    return new Notification()
      .query(qb => {
        if (search) {
          qb.whereRaw('LOWER(to_char(id,\'999\')) LIKE ?', [`%${_.toLower(search)}%`]);
          qb.orWhereRaw('LOWER(type) LIKE ?', [`%${_.toLower(search)}%`]);
          qb.orWhereRaw('LOWER(recipients) LIKE ?', [`%${_.toLower(search)}%`]);
        }
      })
      .orderBy('created_at', 'desc')
      .fetchPage({
        pageSize,
        page,
        withRelated: ['user']
      })
      .then(result => res.status(200).send(this.formatResponse({
        data: result.toJSON(),
        pagination: result.pagination
      })))
      .catch(next);
  }
}

module.exports = {
  NotificationsController
};