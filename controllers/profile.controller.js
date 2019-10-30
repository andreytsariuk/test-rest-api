'use strict';
const {
  request, // eslint-disable-line no-unused-vars
  response // eslint-disable-line no-unused-vars
} = require('express')();
const {
  Profile
} = require('../db/models');
const {
  RoleBaseInstructions,
  AbstractRoutesController
} = require('../datatypes');



class ProfilesController extends AbstractRoutesController {


  constructor(...params) {
    super(...params);

    this.instructions = new RoleBaseInstructions()
      .add(this.constants.CONTROLLERS_METHODS.GET, {
        or: [
          this.constants.ROLES.USER,
          this.constants.ROLES.ADMIN,
          this.constants.ROLES.SU
        ]
      }, this.getProfileByUser)
      .add(this.constants.CONTROLLERS_METHODS.GET, {
        or: [
          this.constants.ROLES.ADMIN,
          this.constants.ROLES.SU
        ]
      }, this.getProfileByUser)
      .add(this.constants.CONTROLLERS_METHODS.PUT, {
        or: [
          this.constants.ROLES.USER,
          this.constants.ROLES.ADMIN,
          this.constants.ROLES.SU
        ]
      }, this.updateUserProfileByUser)
      .add(this.constants.CONTROLLERS_METHODS.PUT, {
        or: [
          this.constants.ROLES.ADMIN,
          this.constants.ROLES.SU
        ]
      }, this.updateUserProfileByUser);
  }


  /**
   * Return profile of authorized User
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  getProfileByUser(req, res, next) {
    return new Profile({
      id: req.user.id
    })
      .fetch({
        require: true,
        withRelated: 'businessAddress'
      })
      .then(profile => profile.decryptPD(req.user))
      .then(profile => res.status(200).send(this.formatResponse(profile)))
      .catch(next);
  }


  /**
   * Return profile of requested user by ID
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  getProfileByAdmin(req, res, next) {
    return new Profile({
      id: req.requestedUser.id
    })
      .fetch({
        require: true
      })
      .then(profile => profile.decryptPD(req.user))
      .then(profile => res.status(200).send(this.formatResponse(profile)))
      .catch(next);
  }


  /**
   * Updates authorized user profile
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  updateUserProfileByUser(req, res, next) {
    const ProfileUpdate = req.body;

    return req.user.user
      .related('profile')
      .save(ProfileUpdate, {
        method: 'update'
      })
      .then(profile => profile.refresh())
      .then(profile => res.status(200).send(this.formatResponse(profile)))
      .catch(next);
  }


  /**
   * Updates requested user profile by ID
   * @param {request} req 
   * @param {response} res 
   * @param {function} next 
   */
  updateUserProfileByAdmin(req, res, next) {
    const ProfileUpdate = req.body;

    return req.requestedUser
      .related('profile')
      .save(ProfileUpdate, {
        method: 'update'
      })
      .then(profile => res.status(200).send(this.formatResponse(profile)))
      .catch(next);
  }
}


module.exports = {
  ProfilesController
};