//Require the dependencies
const appVersion = require('../../package.json').version;

const {
  AbstractRoutesControllerTests
} = require('./AbstractRoutesController.test');


module.exports = {
  runTests
};


/**
 * Main Function
 */
function runTests() {

  console.log(`=====================Start TESTS for version: ${appVersion}=====================`);
  // before(()=>clearAfterTests());
  AbstractRoutesControllerTests.bind(this)();
  // after(() => clearAfterTests());
}

runTests();