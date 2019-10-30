
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app');
chai.use(chaiHttp);


module.exports = {
  SignInTests
};


/**
 * Main Function
 */
function SignInTests() {
  describe('Sign-In', async () => {
    POST_invalidSignIn.bind(this)();
    POST_SignIn.bind(this)();
    POST_UserSignIn.bind(this)();
    return;
  });
}



/**
 * Try to sign in with invalid credentials
 */
function POST_invalidSignIn() {
  it('it should return error about invalid credentials',
    async () => {
      let response = await chai.request(server)
        .post('/auth/v1/sign-in')
        .set('content-type', 'application/json')
        .send({
          email: 'test@test.comtest@test.comtest@test.com',
          password: 'test_testtest@test.comtest@test.com'
        });

      response.should.have.status(403);
      response.body.code.should.be.a('string');
      response.body.description.should.be.a('string');
      return;
    });
}

/**
 * Should signIn with correct credentials
 */
function POST_SignIn() {
  it('it should sign in with correct credentials as a SU',
    async () => {
      let response = await chai.request(server)
        .post('/auth/v1/sign-in')
        .set('content-type', 'application/json')
        .send({
          email: 'test.aba.su@gmail.com',
          password: 'test_test'
        });
      response.should.have.status(200);
      response.body.user.should.be.a('object');
      response.body.accessToken.should.be.a('string');
      response.body.expiresAt.should.be.a('string');

      this.access_token = response.body.accessToken;
      this.admin = response.body.user;
    });
}

/**
 * Should signIn with correct credentials
 */
function POST_UserSignIn() {
  it('it should sign in with correct credentials as a User',
    async () => {
      let response = await chai.request(server)
        .post('/auth/v1/sign-in')
        .set('content-type', 'application/json')
        .send({
          email: 'test.aba.user@gmail.com',
          password: 'test_test'
        });
      response.should.have.status(200);
      response.body.user.should.be.a('object');
      response.body.accessToken.should.be.a('string');
      response.body.expiresAt.should.be.a('string');

      this.user_access_token = response.body.accessToken;
      this.curr_user = response.body.user;
    });
}
