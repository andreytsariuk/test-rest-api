//==============Require All related tests==============
const { UsersTests } = require('./users.test');
const { InvitesTests } = require('./invites.test');
const { NotificationsTests } = require('./notifications.test');


module.exports = {
  AdminTests
};


/**
 * Main Function
 */
function AdminTests() {
  describe('Admin Area', async () => {
    UsersTests.bind(this)();
    InvitesTests.bind(this)();
    NotificationsTests.bind(this)();
    return;
  });
}














