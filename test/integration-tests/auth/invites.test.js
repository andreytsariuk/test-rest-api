
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app');
chai.use(chaiHttp);


module.exports = {
  InvitesTests
};


/**
 * Main Function
 */
function InvitesTests() {
  describe('Invitation', async () => {
    GET_getIncorrectInvitationToken.bind(this)();
    POST_signUpWithIncorrectInvite.bind(this)();
    POST_signUpWithoutInvite.bind(this)();
    return;
  });
}


/**
 * Try to get incorrect invitation token
 */
function GET_getIncorrectInvitationToken() {
  it('it should return error about invalid invitation link',
    async () => {
      let response = await chai.request(server)
        .get('/auth/v1/invite')
        .query({ token: 'mocha_test' });
      response.should.have.status(403);

      response.body.code.should.be.a('string');
      response.body.description.should.be.a('string');
      return;
    });
}


/**
 * Try to signUp with incorrect invitation
 */
function POST_signUpWithIncorrectInvite() {
  it('it should return error about incorrect invite',
    async () => {
      let response = await chai.request(server)
        .post('/auth/v1/sign-up')
        .set('content-type', 'application/json')
        .send({
          email: 'test@test.com',
          password: 'test_test',
          invite: 'mocha_test'
        });

      response.should.have.status(403);

      response.body.code.should.be.a('string');
      response.body.description.should.be.a('string');
      return;
    });
}


/**
 * Try to signUp without invitation
 */
function POST_signUpWithoutInvite() {
  it('it should return error about empty invite',
    async () => {
      let response = await chai.request(server)
        .post('/auth/v1/sign-up')
        .set('content-type', 'application/json')
        .send({
          email: 'test_mocha@test_mocha_2.com',
          password: 'test_test'
        });

      response.should.have.status(409);

      response.body.code.should.be.a('string');
      response.body.description.should.be.a('string');
      return;
    });
}
