const config = require('config');
let conf = config.get('Db');
const knex = require('knex')(conf);
const bookshelf = require('bookshelf')(knex);

bookshelf
  .plugin('registry')
  .plugin('virtuals')
  .plugin('visibility')
  .plugin('pagination')
  .plugin(require('bookshelf-soft-delete'));

module.exports = bookshelf;