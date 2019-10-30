const Bookshelf = require('../../config/bookshelf');
const suid = require('rand-token').suid;
const moment = require('moment');
const Promise = require('bluebird');
const {
  ERRORS
} = require('../../constants');


module.exports = Bookshelf.model('Invite', Bookshelf.Model.extend({
  tableName: 'invites',
  //	hidden: ['created_at', 'updated_at'],
  hasTimestamps: true,
  initialize: function () {
    this.on('creating', this.beforeSave);
  },
  beforeSave: function () {
    this.attributes.token = suid(16);
    this.attributes.expires_at = moment().add('5', 'hours').toISOString();
    return this;
  },
  user: function () {
    return this.belongsTo('Users');
  },
  validate(params = {
    useExpires: true
  }) {
    //check For Errors;
    return new Promise((resolve, reject) => {
      switch (true) {
      case moment(this.get('expires_at')) < moment() && params.useExpires:
        return reject(new Error(ERRORS.INVITE_EXPIRED));

      case this.get('used'):
        return reject(new Error(ERRORS.INVITE_INCORRECT));

      default:
        return resolve(this);
      }
    });
  },
  markAsUsed(email) {
    return this
      .where({
        email
      })
      .fetchAll()
      .then(result => Promise.map(result.models, model => model.save({
        used: true
      }, {
        method: 'update'
      })));
  }
}));