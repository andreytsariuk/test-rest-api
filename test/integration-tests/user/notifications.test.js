
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../../app');
chai.use(chaiHttp);


module.exports = {
  NotificationsTests
};


/**
 * Main Function
 */
function NotificationsTests() {
  describe('USER Notifications api/v1/notifications',
    async () => {
      GET_unAuthNotificationList.bind(this)();
      GET_notificationListByUser.bind(this)();
      return;
    });
}



/**
 * Try to get without authorization
 */
function GET_unAuthNotificationList() {
  it('it should GET unauthorized error on GET',
    done => {
      chai.request(server)
        .get('/api/v1/notifications')
        .end((err, res) => {
          should.equal(err, null);
          res.should.have.status(401);
          res.body.code.should.be.a('string');
          res.body.description.should.be.a('string');
          done();
        });
    });
}

/**
 * Should get notification List with just user_id property on each notification 
 */
function GET_notificationListByUser() {
  it('it should get notification List by regular user',
    done => {
      chai.request(server)
        .get('/api/v1/notifications')
        .set('Authorization', `Bearer ${this.user_access_token}`)
        .end((err, res) => {
          should.equal(err, null);
          res.should.have.status(200);
          res.body.data.should.be.an('array');    
          res.body.pagination.should.be.an('object');
          done();
        });
    });
}