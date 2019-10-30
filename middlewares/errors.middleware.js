'use strict';
const Bookshelf = require('../config/bookshelf');
const {
  LoggerService
} = require('../services');
const {
  ERRORS
} = require('../constants');

module.exports = (err, req, res, next) => {
  LoggerService.error('ERROR MIDDLEWARE', err);
  switch (true) {

  //-------------------401 Unauthorized Cases---------------------
  case err.message === ERRORS.INCORRECT_CREDENTIALS:
    return res.status(401).send({
      code: err.message,
      description: 'Incorrect credentials.'
    });

  case err.message === ERRORS.UNAUTHORIZED:
    return res.status(401).send({
      code: err.message,
      description: 'Unauthorized'
    });

  case err.message === ERRORS.TOKEN_NOT_PROVIDED:
    return res.status(401).send({
      code: err.message,
      description: 'Access token not provided in request.'
    });

  case err.message === ERRORS.INVALID_TOKEN || err.message === ERRORS.INVALID_TOKEN.replace('_', ' '):
    return res.status(401).send({
      code: err.message,
      description: 'Access token is incorrect.'
    });
  case err.name === ERRORS.TOKEN_EXPIRED:
    return res.status(401).send({
      code: 'jwt_expired',
      description: 'Your token has expired.'
    });



    //-------------------403 Forbidden Cases---------------------
  case err.message === ERRORS.NEEDS_PERMISSIONS:
    return res.status(403).send({
      code: err.message,
      description: 'You have not needed access rights'
    });
  case err.message === ERRORS.INVITE_EXPIRED:
    return res.status(403).send({
      code: err.message,
      description: 'Your invite has been expired.'
    });
  case err.message === ERRORS.INVITE_INCORRECT:
    return res.status(403).send({
      code: err.message,
      description: 'Your invitation link is incorrect.'
    });
  case err.message === ERRORS.INVITE_RULES_IS_INVALID:
    return res.status(403).send({
      code: err.message,
      description: 'Not valid invite rules provided.'
    });
  case err.message === ERRORS.INVALID_CREDENTIALS:
    return res.status(403).send({
      code: err.message,
      description: 'Your email or password are incorrect'
    });

  case err.message === ERRORS.ACCESS_TOKEN_IS_INCORRECT:
    return res.status(403).send({
      code: err.message,
      description: 'Your access token is incorrect'
    });


    //-------------------400 Bad requests Cases-----------------------
  case err.message === ERRORS.INVALID_REQUEST:
    return res.status(400).send({
      code: err.message,
      description: err.description || 'Bad request.'
    });


    //-------------------404 Not Found Cases-----------------------
  case err instanceof Bookshelf.NotFoundError:
    return res.status(404).send({
      code: err.code,
      description: 'Requested model was not found.'
    });

  case err.message === ERRORS.URL_NOT_FOUND:
    return res.status(404).send({
      code: err.message,
      description: 'Requested Url was not found.'
    });

  case err.message === ERRORS.NOT_FOUND:
    return res.status(404).send({
      code: 'not_found',
      description: 'Requested Url was not found.'
    });

    //-------------------409 Conflict Cases-----------------------

  case err.code === ERRORS.BOOKSHELF.CODES.ALREADY_EXISTS:
    return res.status(409).send({
      code: err.constraint,
      description: `The same ${String(err.table).slice(0, err.table.length - 1)} already exist`
    });

  case err.message === ERRORS.USER_ALREADY_REGISTERED:
    return res.status(409).send({
      code: err.message,
      description: 'User with same E-mail already registered.'
    });


  case err.message === ERRORS.EMAIL_DOES_NOT_EXISTS:
    return res.status(409).send({
      code: err.message,
      description: 'Entered email address doesn\'t exist'
    });

  //-------------------AWS errors---------------------
  case err.type === ERRORS.AWS_ERROR:
    return res.status(err.statusCode || 500).send({
      code: err.code,
      description: 'AWS service or networking error'
    });

  case err.message === ERRORS.UNEXPECTED_ERROR:
    return res.status(500).send({
      code: err.message,
      description: 'An unexpected error occurred'
    });

  case err.message === ERRORS.VALIDATION_ERROR:
    return res.status(400).send({
      code: err.message,
      description: err.description || 'Validation Error',
      details: err.details ? err.details : []
    });

    //-------------------500 Default-----------------------
  default:
    return res.status(500).send('Oops, something went wrong...');
  }
};