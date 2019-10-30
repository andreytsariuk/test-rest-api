const {
  request, // eslint-disable-line no-unused-vars
  response // eslint-disable-line no-unused-vars
} = require('express')();
const RoleBaseInstructions = require('./RoleBaseInstructions.class');
const _ = require('lodash');
const constants = require('../constants');
const {
  LoggerService
} = require('../services');

module.exports = class AbstractRoutesController {


  /**
   * 
   * @param {object} dependencies 
   */
  constructor(dependencies) {
    this.instructions = new RoleBaseInstructions();
    _.forIn(dependencies, (value, key) => {
      this[key] = value;
    });
    this.constants = constants;
    this.logger = LoggerService;
  }


  /**
   * 
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  list(req, res, next) {
    return this.instructions
      .exec(
        this.constants.CONTROLLERS_METHODS.LIST,
        req.user.roles_names
      ).bind(this)(req, res, next);
  }


  /**
   * 
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  get(req, res, next) {
    return this.instructions
      .exec(
        this.constants.CONTROLLERS_METHODS.GET,
        req.user.roles_names
      ).bind(this)(req, res, next);
  }


  /**
   * 
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  post(req, res, next) {
    return this.instructions
      .exec(
        this.constants.CONTROLLERS_METHODS.POST,
        req.user.roles_names
      ).bind(this)(req, res, next);
  }


  /**
   * 
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  put(req, res, next) {
    return this.instructions
      .exec(
        this.constants.CONTROLLERS_METHODS.PUT,
        req.user.roles_names
      ).bind(this)(req, res, next);
  }


  /**
   * 
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  delete(req, res, next) {
    return this.instructions
      .exec(
        this.constants.CONTROLLERS_METHODS.DELETE,
        req.user.roles_names
      ).bind(this)(req, res, next);
  }


  /**
   * 
   * @param {any} response 
   * @param {object} options 
   * @param {boolean} options.convertNumbers default true
   */
  formatResponse(response, options = {
    convertNumbers: true
  }) {
    try {
      response = response.toJSON();
    } catch (error) {
      //do nothing
    }

    if (_.isArray(response)) {
      return response.map(el => this.formatResponse(el));

    } else if (_.isObject(response)) {
      let out = {};
      _.forIn(response, (value, key) => {
        let newKey = key[0] === '_' ? '_' + _.camelCase(key) : _.camelCase(key);
        out[newKey] = this.formatResponse(value);

      });
      return out;

    } else {
      if (options.convertNumbers) {
        let num;
        if (/^[0-9]+\.?[0-9]*$/.test(response))
          num = parseFloat(response);
        if (/^[0-9]+$/.test(response))
          num = parseInt(response);
        if (!num)
          return response;
        else
          return num;
      } else
        return response;
    }
  }
};