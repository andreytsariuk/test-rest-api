const crypto = require('crypto');
const {
  ERRORS
} = require('../../constants');

module.exports = class PasswordsHelper {

  /**
   * hash password with sha512.
   * @function
   * @param {string} password - List of required fields.
   * @param {string} salt - Data to be validated.
   */
  static sha512(password, salt) {
    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest('hex');

    return {
      salt: salt,
      passwordHash: value
    };
  }

  /**
   * Will generate new passwordData for user 
   * @param {string} userpassword 
   */
  static saltHashPassword(userpassword) {
    let salt = PasswordsHelper.genRandomString(); /** Gives us salt of length 16 */
    return PasswordsHelper.sha512(userpassword, salt);
  }

  /**
   * generates random string of characters i.e salt
   * @function
   * @param {number} length - Length of the random string.
   */
  static genRandomString(length = 16) {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex') /** convert to hexadecimal format */
      .slice(0, length); /** return required number of characters */
  }

  /**
   * 
   * @param {string} receivedPass 
   * @param {string} userHash 
   * @param {string} userSalt 
   */
  static checkHash(receivedPass, userHash, userSalt) {
    let checkData = PasswordsHelper.sha512(receivedPass, userSalt);
    if (checkData.passwordHash !== userHash)
      throw new Error(ERRORS.INVALID_CREDENTIALS);

  }
};