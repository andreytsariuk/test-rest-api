
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app');
chai.use(chaiHttp);


module.exports = {
  ResetPasswordTest
};


/**
 * Main Function
 */
function ResetPasswordTest() {
  describe('Reset-Password', async () => {
    GET_getIncorrectResetPasswordToken.bind(this)();
    POST_resetPasswordWithoutToken.bind(this)();
    POST_resetPasswordWithIncorrectToken.bind(this)();
    return;
  });
}


/**
 * Try to sign in with invalid credentials
 */
function GET_getIncorrectResetPasswordToken() {
  it('it should return error about got incorrect reset password token',
    async () => {
      let response = await chai.request(server)
        .get('/auth/v1/token/reset-password')
        .query({ token: 'mocha_test' });

      response.should.have.status(403);

      response.body.code.should.be.a('string');
      response.body.description.should.be.a('string');
      return;
    });
}

/**
 * Try Reset Password with incorrect token
 */
function POST_resetPasswordWithIncorrectToken() {
  it('it should return error about invalid reset password Token',
    async () => {
      let response = await chai.request(server)
        .post('/auth/v1/reset-password')
        .set('content-type', 'application/json')
        .send({
          token: 'mocha_test',
          newPassword: 'test_test'
        });

      response.should.have.status(403);

      response.body.code.should.be.a('string');
      response.body.description.should.be.a('string');
      return;
    });
}


/**
 * try to reset password without token
 */
function POST_resetPasswordWithoutToken() {
  it('it should return error about reset password without token',
    async () => {
      let response = await chai.request(server)
        .post('/auth/v1/reset-password')
        .set('content-type', 'application/json')
        .send({
          newPassword: 'test_test'
        });

      response.should.have.status(409);

      response.body.code.should.be.a('string');
      response.body.description.should.be.a('string');
      return;
    });
}