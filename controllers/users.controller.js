'use strict';
const {
  request, // eslint-disable-line no-unused-vars
  response // eslint-disable-line no-unused-vars
} = require('express')();
const {
  User
} = require('../db/models');
const {
  PasswordsHelper
} = require('../helpers');
const {
  AbstractRoutesController
} = require('../datatypes');
const _ = require('lodash');


class UsersController extends AbstractRoutesController {


  constructor(...params) {
    super(...params);
  }


  /**
   * Return The list of users with Pagination
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  list(req, res, next) {
    const {
      PageLimit,
      PageNumber,
      Search,
      SortBy
    } = req.query;

    return new User()
      .query(qb => {


        if (Search) {
          qb.where(function () {
            this
              .whereRaw('LOWER(to_char(users.id,\'999\')) LIKE ?', [`%${_.toLower(Search)}%`]);
          });

        }

        if (SortBy) {
          SortBy
            // Throw away empty fields
            .filter(x => x)
            .map(col => {
              if (col.startsWith('-')) {
                return {
                  column: col.slice(1),
                  order: 'desc'
                };
              }
              return {
                column: col
              };
            })
            .forEach(({
              column,
              order
            }) => qb.orderBy(`users.${_.snakeCase(column)}`, order));
        }

        qb.clearSelect();
        qb.distinct();
      })
      .fetchPage({
        pageSize: PageLimit,
        page: PageNumber,
        withRelated: ['roles', 'profile']
      })
      .then(result => res.status(200).send(this.formatResponse({
        data: result.toJSON(),
        pagination: result.pagination
      })))
      .catch(next);
  }


  /**
   * Return current user with related information
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  get(req, res, next) {
    return req.requestedUser.refresh({
      withRelated: ['profile', 'roles']
    })
      .then(user => res.status(200).send(this.formatResponse(user)))
      .catch(next);
  }


  /**
   * Will update current user and return it
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  put(req, res, next) {

    const UserUpdate = req.body;
    return req.requestedUser
      .save({
        name: UserUpdate.name,
        email: UserUpdate.email,
      })
      .tap(newUser => (UserUpdate.roles && Array.isArray(UserUpdate.roles)) && newUser
        .related('roles')
        .detach(newUser.related('roles').map('id'))
        .then(() => newUser.related('roles').attach(UserUpdate.roles)))
      .tap(newUser => newUser.refresh({
        withRelated: ['roles', 'profile']
      }))
      .then(newUser => res.status(200).send(this.formatResponse(newUser)))
      .catch(next);
  }


  /**
   * Will create new user 
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  post(req, res, next) {
    const UserCreate = req.body;

    let passwordData = PasswordsHelper.saltHashPassword(UserCreate.password);
    return new User({
      name: UserCreate.name,
      email: UserCreate.email,
      password: passwordData.passwordHash,
      salt: passwordData.salt,
      identifier: `local:${UserCreate.email}`
    })
      .save()
      .tap(newUser => UserCreate.roles && newUser.related('roles').attach(UserCreate.roles))
      .tap(newUser => newUser.related('profile').save(UserCreate.profile || {}))
      .tap(newUser => newUser.refresh({
        withRelated: ['profile', 'roles']
      }))
      .then(newUser => res.status(201).send(this.formatResponse(newUser)))
      .catch(next);
  }


  /**
   * Will remove user and return status of the operation
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  delete(req, res, next) {
    return req.requestedUser
      .destroy()
      .then(() => res.status(200).send(this.formatResponse({
        code: 'user_deleted'
      })))
      .catch(next);
  }
}


module.exports = {
  UsersController
};