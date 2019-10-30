'use strict';
//==============================REQUIRES======================
const {
  Router
} = require('express');
const {
  profileRouter
} = require('./profile.router');
const {
  notificationsRouter
} = require('./notifications.router');
const {
  usersController
} = require('./../../../../controllers');
const {
  User
} = require('../../../../db/models');
const usersRouter =  Router();


//==============================ROUTES=========================

usersRouter
  .get('/', usersController.list)
  .post('/', usersController.post);


usersRouter.param('userId', (req, res, next, user_id) => {
  new User({
    id: user_id
  })
    .fetch({
      require: true,
      withRelated: ['roles', 'profile']
    })
    .then(user => req.requestedUser = user)
    .then(() => next())
    .catch(next);
});

usersRouter
  .put('/:userId', usersController.put)
  .get('/:userId', usersController.get)
  .delete('/:userId', usersController.delete);

usersRouter
  .use('/:userId/profile', profileRouter)
  .use('/:userId/notifications', notificationsRouter);

//============================MAIN EXPORT======================
module.exports = {
  usersRouter
};