const {
  request, // eslint-disable-line no-unused-vars
  response // eslint-disable-line no-unused-vars
} = require('express')();
const {
  LoggerService
} = require('../services');
const _ = require('lodash');
const fieldsToIgnore = [
  'logo',
  'email',
  'billingEmail'
];


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {function} next 
 */
module.exports = (req, res, next) => {


  LoggerService.info(`${req.method} ${req.originalUrl}`, {
    body: _.omit(req.body, fieldsToIgnore),
    query: req.query
  });
  next();
};