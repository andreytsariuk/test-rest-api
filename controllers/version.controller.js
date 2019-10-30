'use strict';
const {
  request,// eslint-disable-line no-unused-vars
  response// eslint-disable-line no-unused-vars
} = require('express')();
const appVersion = require('../package.json').version;
const {
  AbstractRoutesController
} = require('../datatypes');



class VersionsController extends AbstractRoutesController {


  constructor(...params) {
    super(...params);
  }


  /**
   * 
   * @param {request} req 
   * @param {response} res 
   */
  get(req, res) {
    return res.status(200).json(this.formatResponse({
      version: appVersion
    }));
  }
}

module.exports = {
  VersionsController
};