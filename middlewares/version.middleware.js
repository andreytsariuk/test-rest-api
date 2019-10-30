const {
  request,// eslint-disable-line no-unused-vars
  response// eslint-disable-line no-unused-vars
} = require('express')();
const version = require('../package.json').version;
/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {function} next 
 */
module.exports = (req, res, next) => {
  res.setHeader('version', version);
  next();
};