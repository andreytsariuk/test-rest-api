
//==============Require All related tests==============
const { InvitesTests } = require('./invites.test');
const { ResetPasswordTest } = require('./resetPassword.test');
const { SignInTests } = require('./signIn.test');


module.exports = {
  AuthTests
};


/**
 * Main Function
 */
function AuthTests() {
  describe('Auth Area', async () => {
    InvitesTests.bind(this)();
    ResetPasswordTest.bind(this)();
    SignInTests.bind(this)();
    return;
  });
}














