const Bookshelf = require('../../config/bookshelf');


module.exports = Bookshelf.model('UserRole', Bookshelf.Model.extend({
  tableName: 'users_roles',
  users() {
    return this.hasMany('User');
  },
  roles() {
    return this.hasMany('Role');
  }
}));


