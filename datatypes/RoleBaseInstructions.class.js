const {
  ERRORS
} = require('../constants');

class RoleBaseInstructions {

  /**
   * This class provides the easy way to manipulate with different types of roles. 
   * Roles are the array and looks like this: ['admin','user']
   * You can set specific listener for each type of roles combinations
   */
  constructor() {
    /**
     * @type {Map}
     */
    this.__privateInstructionsMap = new Map();
  }

  /**
   * The private function that needs to create different combinations of roles
   * @private 
   * @param {Array<String>} roles 
   */
  __getCombinations(roles) {
    let result = [];
    let f = function (prefix, chars) {
      for (var i = 0; i < chars.length; i++) {
        result.push(prefix + chars[i]);
        f(prefix + chars[i], chars.slice(i + 1));
      }
    };
    f('', roles);
    return result;
  }

  /**
   * @param {string} method 
   * @param {object} roles 
   * @param {Array<string>} roles.and means that only user who has all of provided roles can accept this handler
   * @param {Array<Array<string>>} roles.and means that only user who has all of provided roles can accept this handler
   * @param {Array<string>} roles.or means that any user who has at least one of provided roles can accept this handler
   * @param {function} handler
   * @returns {RolesSwitcher} 
   */
  add(method, roles, handler) {
    if (!roles.or && !roles.and)
      throw new Error('No any type of instructions has been provided for RolesSwitcher!');

    if (roles.or) {
      const rolesCombination = this.__getCombinations(roles.or);
      rolesCombination.forEach(role => this.__privateInstructionsMap.set(method + '_' + role, handler));
    }

    if (roles.and) {
      this.__privateInstructionsMap.set(method + '_' + roles.and.sort().join(''), handler);
    }

    return this;
  }

  /**
   * Returns the handler that are matched to user roles and provided instruction
   * If no suitable handler the 'needs_permission' error will occurs 
   * @param {string} method 
   * @param {Array<string>} roles
   * @returns {function} 
   */
  exec(method, roles) {
    roles = roles.sort();
    let handler = this.__privateInstructionsMap.get(method + '_' + roles.join(''));

    if (!handler && roles.length > 1) {
      this.__getCombinations(roles).some(role => {
        let try_handler = this.__privateInstructionsMap.get(method + '_' + role);
        return try_handler ? handler = try_handler : false;
      });
    }
    if (!handler)
      throw new Error(ERRORS.NEEDS_PERMISSIONS);
    return handler;
  }
}

module.exports = RoleBaseInstructions;