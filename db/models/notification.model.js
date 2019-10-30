const Bookshelf = require('../../config/bookshelf');


module.exports = Bookshelf.model('Notification', Bookshelf.Model.extend({
  tableName: 'notifications',
  hasTimestamps: true,
  user: function () {
    return this.belongsTo('User');
  }
}));