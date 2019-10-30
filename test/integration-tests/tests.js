//=========Run on Any Env=======
const previousNodeEnv = process.env.NODE_ENV;
switch (previousNodeEnv) {
case 'staging':
  process.env.NODE_ENV = 'test_staging';
  break;

default:
  process.env.NODE_ENV = 'test';
  break;
}


//Require the dependencies
const appVersion = require('../../package.json').version;
const {
  User
} = require('../../db/models');
const Promise = require('bluebird');

//---------------Import Tests---------------
const {
  AdminTests
} = require('./admin');
const {
  AuthTests
} = require('./auth');
const {
  PublicTests
} = require('./public');
const {
  UserTests
} = require('./user');


module.exports = {
  runTests
};


/**
 * Main Function
 */
function runTests() {

  console.log(`=====================Start TESTS for version: ${appVersion}=====================`);
  before(() => clearAfterTests());
  PublicTests.bind(this)();
  AuthTests.bind(this)();
  AdminTests.bind(this)();
  UserTests.bind(this)();
  after(() => clearAfterTests());
}

function clearAfterTests() {
  return Promise.all([
    new User({
      email: 'test_mocha@test.com'
    })
      .fetch()
      .then(user => user ?
        user.destroy() :
        Promise.resolve()),
  ])
    .then(() => console.log(`=====================End TESTS for version: ${appVersion}=====================`))
    .then(() => process.env.NODE_ENV = previousNodeEnv)
    .catch(console.log);
}





runTests();