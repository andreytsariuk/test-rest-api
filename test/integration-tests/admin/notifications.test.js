
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
  describe('ADMIN Notifications api/v1/notifications, api/v1/users/{userId}/notifications',
    async () => {
      GET_unAuthNotificationList.bind(this)();
      GET_notificationListByAdmin.bind(this)();
      GET_usersNotificationList.bind(this)();
      return;
    });
}



/**
 * Try to get without authorization
 */
function GET_unAuthNotificationList() {
  it('it should GET unauthorized error on GET for his own notifications',
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

  it('it should GET unauthorized error on GET when retrieving other user\'s notification list',
    done => {
      chai.request(server)
        .get(`/api/v1/users/${this.curr_user.id}/notifications`)
        .end((err, res) => {
          should.equal(err, null);
          res.should.have.status(401);
          res.body.code.should.be.a('string');
          res.body.description.should.be.a('string');
          done();
        });
    });
}

// Should get notification List with nested user object on each notification
function GET_notificationListByAdmin() {
  it('it should get notification List by admin',
    done => {
      chai.request(server)
        .get('/api/v1/notifications')
        .set('Authorization', `Bearer ${this.access_token}`)
        .end((err, res) => {
          should.equal(err, null);
          res.should.have.status(200);
          res.body.data.should.be.an('array').that.is.not.empty;
          res.body.pagination.should.be.an('object');
          done();
        });
    });
}

// Should get notification List for the specified user
function GET_usersNotificationList() {
  it('it should get notification List for the specified user',
    done => {
      chai.request(server)
        .get(`/api/v1/users/${this.curr_user.id}/notifications`)
        .set('Authorization', `Bearer ${this.access_token}`)
        .end((err, res) => {
          should.equal(err, null);
          res.should.have.status(200);
          res.body.data.should.be.an('array');
          res.body.pagination.should.be.an('object');
          done();
        });
    });
}