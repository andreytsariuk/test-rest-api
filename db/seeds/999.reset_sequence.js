const {
  ERRORS
} = require('../constants');

exports.seed = function (knex, Promise) {
  return knex
    .raw(`
               SELECT table_name FROM information_schema.tables
               WHERE table_schema = 'public'
             `)
    .then(res => res.rows.map(r => r.table_name)
      .filter(tableName => tableName !== 'migrations_lock'))
    .then(tables => Promise
      .all(tables
        .map(tableName => knex
          .raw(`
            SELECT
              setval(pg_get_serial_sequence('${tableName}', 'id'),
              coalesce(max(id), 0) + 1, false)
            FROM ${tableName};
      `)
          .catch(err => {
            if (err.code === ERRORS.CODES.FIELD_ID_DOES_NOT_EXIST)
              return;
            else throw err;
          })
        )));
};