'use strict';
//==============================REQUIRES======================
const {
  Router
} = require('express');
const {
  invitesController
} = require('./../../../controllers');
const {
  Invite
} = require('../../../db/models');
const invitesRouter = Router();




//==============================ROUTES=========================
invitesRouter
  .post('/', invitesController.post)
  .get('/', invitesController.list);

invitesRouter.param('inviteId', (req, res, next, invite_id) => {
  // try to get the invite details from the invites model and attach it to the request object
  new Invite({
    id: invite_id
  })
    .fetch({
      require: true
    })
    .then(invite => req.requestedInvite = invite)
    .then(() => next())
    .catch(next);
});

invitesRouter
  .get('/:inviteId', invitesController.get)
  .delete('/:inviteId', invitesController.delete);


//============================MAIN EXPORT======================
module.exports = {
  invitesRouter
};