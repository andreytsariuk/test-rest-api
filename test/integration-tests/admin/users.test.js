
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app');
chai.use(chaiHttp);


module.exports = {
  UsersTests
};


/**
 * Main Function
 */
function UsersTests() {
  describe('ADMIN Users api/v1/user ',
    async () => {
      GET_unAuthUserList.bind(this)();
      GET_usersList.bind(this)();
      POST_createUser.bind(this)();
      PUT_updateUser.bind(this)();
      DELETE_deleteUser.bind(this)();
      return;
    });
}



/**
 * Try to get without authorization
 */
function GET_unAuthUserList() {
  it('it should GET unauthorized error on GET',
    async () => {
      const response = await chai.request(server).get('/api/v1/users');
      response.should.have.status(401);
      response.body.code.should.be.a('string');
      response.body.description.should.be.a('string');
      return;
    });

  it('it should GET unauthorized error on POST',
    async () => {
      const response = await chai.request(server).post('/api/v1/users');
      response.should.have.status(401);
      response.body.code.should.be.a('string');
      response.body.description.should.be.a('string');
      return;
    });

  it('it should GET unauthorized error on PUT',
    async () => {
      const response = await chai.request(server).post('/api/v1/users');
      response.should.have.status(401);
      response.body.code.should.be.a('string');
      response.body.description.should.be.a('string');
      return;
    });

  it('it should GET unauthorized error on DELETE',
    async () => {
      const response = await chai.request(server).post('/api/v1/users');
      response.should.have.status(401);
      response.body.code.should.be.a('string');
      response.body.description.should.be.a('string');
      return;
    });

}

/**
 * Should get users List
 */
function GET_usersList() {
  it('it should get users List',
    async () => {
      const response = await chai
        .request(server)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${this.access_token}`);
      response.should.have.status(200);
      response.body.data.should.be.a('array');
      response.body.pagination.should.be.a('object');
      return;
    });
}



/**
 * should create new user
 */
function POST_createUser() {
  it('it should create new user',
    async () => {
      let response = await chai.request(server)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${this.access_token}`)
        .set('content-type', 'application/json')
        .send({
          email: 'test_mocha@test.com',
          password: 'Mocha_test1@',
          name: 'Mr. Test'
        });
      response.should.have.status(201);

      response.body.should.be.a('object');
      response.body.id.should.be.a('number');

      this.user = response.body;
      return;
    });
}


/**
 * should update created user
 */
function PUT_updateUser() {

  it('it should update created user',
    async () => {
      let response = await chai.request(server)
        .put(`/api/v1/users/${this.user.id}`)
        .set('Authorization', `Bearer ${this.access_token}`)
        .set('content-type', 'application/json')
        .send({
          email: 'test_mocha@test.com',
          name: 'Mr. Test 2'
        });

      response.should.have.status(200);

      response.body.should.be.a('object');
      response.body.id.should.be.a('number');
      response.body.name.should.not.equal(this.user.name);

      return;
    });
}


/**
 * should delete user that was created
 */
function DELETE_deleteUser() {
  it('it should delete user that was created',
    async () => {
      let response = await chai.request(server)
        .delete(`/api/v1/users/${this.user.id}`)
        .set('Authorization', `Bearer ${this.access_token}`);

      response.should.have.status(200);
      response.body.code.should.be.a('string');
    });
}