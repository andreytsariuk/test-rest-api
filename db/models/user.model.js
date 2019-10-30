const Bookshelf = require('../../config/bookshelf');
const _ = require('lodash');
const {
  ROLES
} = require('../../constants');

module.exports = Bookshelf.model('User', Bookshelf.Model.extend({
  tableName: 'users',
  hidden: ['password', 'identifier', 'salt'],
  hasTimestamps: true,
  profile: function () {
    return this.hasOne('Profile', 'id', 'id');
  },
  roles() {
    return this.belongsToMany('Role').through('UserRole');
  },
  notifications() {
    return this.hasMany('Notification');
  },
  virtuals: {
    isAdmin() {
      return _.findIndex(this.related('roles').toJSON(), (role) => role.name === ROLES.ADMIN || role.name === ROLES.SU) !== -1 ? true : false;
    },
    isUser() {
      return _.findIndex(this.related('roles').toJSON(), (role) => role.name === ROLES.USER) !== -1 ? true : false;
    },
    isSu() {
      return _.findIndex(this.related('roles').toJSON(), (role) => role.name === ROLES.SU) !== -1 ? true : false;
    },
    short_roles() {
      return this.related('roles').map(role => role.get('display_name'));
    },
    roles_names() {
      return this.related('roles').map(role => role.get('name')).sort();
    },
  }
}));