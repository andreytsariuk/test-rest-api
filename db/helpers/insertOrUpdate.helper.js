/**
 * 
 * @param {knex} knex 
 * @param {string} tableName 
 * @param {array} data 
 */
function insertOrUpdate(knex, tableName, data) {
  const firstData = data[0] ? data[0] : data;
  return knex.raw(knex(tableName).insert(data).toQuery() + ' ON CONFLICT (id)  DO UPDATE SET ' +
    Object.getOwnPropertyNames(firstData).map((field) => `${field}=EXCLUDED.${field}`).join(', '));
}


module.exports = insertOrUpdate;