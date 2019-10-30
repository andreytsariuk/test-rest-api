const Promise = require('bluebird');
const config = require('config');
const handlebars = require('handlebars');
const fs = require('fs');
const nodemailer = require('nodemailer');
const ses = require('nodemailer-ses-transport');
const {
  Notification
} = require('../db/models');
const {
  EMAILS_FILES_NAMES,
  EMAIL_TYPES
} = require('../constants');


const transporter = nodemailer.createTransport(ses({
  region: config.get('AWS.SES.REGION')
}));


module.exports = class MandrillService {


  /**
   * Function will send invite to user 
   * @param {string} email 
   * @param {string} token 
   */
  static sendInvite(email, token) {

    // The HTML body of the email.
    return compileEmail(EMAILS_FILES_NAMES.INVITE, {
      verificationText: 'You have been invited to register at the project. Please follow the link below to proceed.',
      buttonText: 'REGISTRATION',
      verificationUrl: `${config.get('WebUrl')}/sign-up?invite=${token}`,
      serverUrl: config.get('serverUrl')
    })
      .then(body_html => ({
        from: config.get('Support.senderEmail'),
        to: email,
        subject: 'User Invitation',
        html: body_html
      }))
      .then(params => transporter.sendMail(params))
      .then(() => new Notification({
        type: EMAIL_TYPES.INVITE,
        recipients: email
      }).save());
  }

  static sendResetPassword(email, token) {

    // The HTML body of the email.
    return compileEmail(EMAILS_FILES_NAMES.RESET_PASSWORD, {
      verificationText: 'You have been initialized reset password process. Please follow the link below to proceed.',
      buttonText: 'RESET PASSWORD',
      verificationUrl: `${config.get('WebUrl')}/reset-password?token=${token}`,
      serverUrl: config.get('serverUrl')
    })
      .then(body_html => ({
        from: config.get('Support.senderEmail'),
        to: email,
        subject: 'Forgot Password',
        html: body_html
      }))
      .then(params => transporter.sendMail(params))
      .then(() => new Notification({
        type: EMAIL_TYPES.RESET_PASSWORD,
        recipients: email
      }).save());
  }
};



/**
 * Function will complie Html for sending
 * @param {*} filename 
 * @param {*} replacements 
 */
function compileEmail(filename, replacements) {
  return Promise
    .fromCallback(callback => readHTMLFile(`${__dirname}/../views/emailTemplates/${filename}.html`, callback))
    .then(html => {
      let template = handlebars.compile(html);
      return template(replacements);
    });
}


/**
 * Function will read html file and return it 
 * @param {*} path 
 * @param {*} callback 
 */
function readHTMLFile(path, callback) {
  fs.readFile(path, {
    encoding: 'utf-8'
  }, function (err, html) {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
}