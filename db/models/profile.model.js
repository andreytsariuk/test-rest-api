const Bookshelf = require('../../config/bookshelf');
const {
  PDCrypto
} = require('../helpers');

module.exports = Bookshelf.model('Profile', Bookshelf.Model.extend({
  tableName: 'profiles',
  hasTimestamps: true,
  initialize() {
    this.on('saving', this.encryptPD)
  },
  encryptPD() {
    if (this.attributes.billing_email) {
      this.attributes.billing_email = PDCrypto.encrypt(this.attributes.billing_email);
    }
    return this;
  },
  //uses to hide E-mail/other PD for all users omit current
  decryptPD(user) {
    if (user.id !== this.id)
      return;

    this.set('billing_email', PDCrypto.decrypt(this.get('billing_email')))
    return this;
  },
  user() {
    return this.belongsTo('User', 'id', 'id');
  },
  businessAddress() {
    return this.belongsTo('Address', 'business_address_id');
  },
  acceptedTermsAndConditions() {
    return this.belongsTo('TermsAndConditions', 'accepted_terms_and_conditions_id', 'id');
  },
  acceptedPrivacyAndPolicy() {
    return this.belongsTo('PrivacyAndPolicy', 'accepted_privacy_and_policy_id', 'id');
  }
}));
