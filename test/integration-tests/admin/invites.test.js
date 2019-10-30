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
  describe('ADMIN Invites api/v1/invite ',
    async () => {
      GET_unAuthInviteList.bind(this)();
      GET_invitesList.bind(this)();
      POST_createInvite.bind(this)();
      POST_createNotValidInvite.bind(this)();
      DELETE_deleteInvite.bind(this)();
      return;
    });
}



/**
 * Try to get without authorization
 */
function GET_unAuthInviteList() {
  it('it should GET unauthorized error on GET',
    async () => {
      const response = await chai.request(server).get('/api/v1/invites');
      response.should.have.status(401);
      response.body.code.should.be.a('string');
      response.body.description.should.be.a('string');
      return;
    });

  it('it should GET unauthorized error on POST',
    async () => {
      const response = await chai.request(server).post('/api/v1/invites');
      response.should.have.status(401);
      response.body.code.should.be.a('string');
      response.body.description.should.be.a('string');

      return;
    });

  it('it should GET unauthorized error on DELETE',
    async () => {
      const response = await chai.request(server).post('/api/v1/invites');
      response.should.have.status(401);
      response.body.code.should.be.a('string');
      response.body.description.should.be.a('string');
      return;
    });
}

/**
 * Should get invites List
 */
function GET_invitesList() {
  it('it should get invites List',
    async () => {
      const response = await chai
        .request(server)
        .get('/api/v1/invites')
        .set('Authorization', `Bearer ${this.access_token}`);

      response.should.have.status(200);
      response.body.data.should.be.a('array');
      response.body.pagination.should.be.a('object');
      return;
    });
}



/**
 * try to create not valid  invite
 */
function POST_createNotValidInvite() {
  it('it try to create not valid  invite',
    async () => {
      let response = await chai.request(server)
        .post('/api/v1/invites')
        .set('Authorization', `Bearer ${this.access_token}`)
        .set('content-type', 'application/json')
        .send({
          email: 'success@simulator.amazonses.com',
          name: 'Mr. Test',
          rules: {
            roles: ['mocha']
          }
        });
      response.should.have.status(409);

      response.body.should.be.a('object');
      response.body.code.should.be.a('string');
      response.body.description.should.be.a('string');
      return;
    });
}

/**
 *  should create new invite
 */
function POST_createInvite() {
  it('it should create new invite',
    async () => {
      let response = await chai.request(server)
        .post('/api/v1/invites')
        .set('Authorization', `Bearer ${this.access_token}`)
        .set('content-type', 'application/json')
        .send({
          email: 'success@simulator.amazonses.com',
          name: 'Mr. Test',
          rules: {
            roles: [3]
          }
        });
      response.should.have.status(201);

      response.body.should.be.a('object');
      response.body.id.should.be.a('number');

      this.invite = response.body;
      return;
    });
}

/**
 * should delete invite that was created
 */
function DELETE_deleteInvite() {
  it('it should delete invite that was created',
    async () => {
      let response = await chai.request(server)
        .delete(`/api/v1/invites/${this.invite.id}`)
        .set('Authorization', `Bearer ${this.access_token}`);

      response.should.have.status(200);
      response.body.code.should.be.a('string');
    });
}