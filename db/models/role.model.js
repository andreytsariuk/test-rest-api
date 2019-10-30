const Bookshelf = require('../../config/bookshelf');


module.exports = Bookshelf.model('Role', Bookshelf.Model.extend({
  tableName: 'roles',
  hasTimestamps: true,
  users: function () {
    return this.belongsToMany('User');
  }

}));