
//==============Require All related tests==============
const { NotificationsTests } = require('./notifications.test');


module.exports = {
  UserTests
};


/**
 * Main Function
 */
function UserTests() {
  describe('User Area', async () => {
    NotificationsTests.bind(this)();
    return;
  });
}