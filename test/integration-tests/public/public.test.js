
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app');
const should = chai.should();
chai.use(chaiHttp);


module.exports = {
  PublicTests
};


/**
 * Main Function
 */
function PublicTests() {
  describe('Public Area', async () => {
    GET_getAppVersion.bind(this)();
    return;
  });
}



/**
 * Try to get App version
 */
function GET_getAppVersion() {
  it('it should return version of application',
    async () => {
      let response = await chai.request(server)
        .get('/public/version');

      response.should.have.status(200);

      response.body.version.should.be.a('string');
      return;
    });
}
