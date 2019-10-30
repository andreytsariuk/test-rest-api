const constants = {
  ROLES: {
    SU: 'su',
    ADMIN: 'admin',
    USER: 'user',
    WHITE_LIST: ['user'],
    BY_ID: {
      SU: 1,
      ADMIN: 2,
      USER: 3,
    },
  },
  PASSWORD_REGEXP: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#!%*?&_\-+^=()<>{}`~])[A-Za-z\d$@$!%*?&].{7,}/,
  EMAIL_PATTERN: '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
  CONTROLLERS_METHODS: {
    POST: 'post',
    GET: 'get',
    PUT: 'put',
    DELETE: 'delete',
    LIST: 'list'
  },
  ERRORS: {
    BOOKSHELF: {
      CODES: {
        ALREADY_EXISTS: '23505'
      }
    },
    INCORRECT_CREDENTIALS: 'incorrect_credentials',
    UNAUTHORIZED: 'unauthorized',
    USER_NOT_FOUND: 'user_not_found',
    TOKEN_NOT_PROVIDED: 'no_token_provided',
    INVALID_TOKEN: 'invalid_token',
    TOKEN_EXPIRED: 'TokenExpiredError',
    NEEDS_PERMISSIONS: 'needs_permission',
    INVITE_EXPIRED: 'invite_expired',
    INVITE_INCORRECT: 'invite_incorrect',
    INVITE_RULES_IS_INVALID: 'not_valid_invite_rules',
    INVALID_CREDENTIALS: 'invalid_credentials',
    ACCESS_TOKEN_IS_INCORRECT: 'access_token_incorrect',
    INVALID_REQUEST: 'invalid_request_error',
    URL_NOT_FOUND: 'api_url_not_found',
    NOT_FOUND: 'Not Found',
    USER_ALREADY_REGISTERED: 'user_already_registered',
    EMAIL_DOES_NOT_EXISTS: 'email_does_not_exist',
    AWS_ERROR: 'aws_error',
    VALIDATION_ERROR: 'validation_error',
    UNEXPECTED_ERROR: 'unexpected_error',
    NO_ONE_FILED_IN_RULES_NOT_PROVIDED:'NO_ONE_FILED_IN_RULES_NOT_PROVIDED'
  },
  EMAILS_FILES_NAMES: {
    INVITE: 'invite',
    RESET_PASSWORD: 'resetPassword'
  },
  EMAIL_TYPES: {
    RESET_PASSWORD: 'RESET_PASSWORD',
    INVITE: 'INVITE',
  }
};

module.exports = constants;
