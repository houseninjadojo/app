import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import { COMPLETED } from 'houseninja/data/enums/onboarding-step';
import { isPresent, isEmpty } from '@ember/utils';

export default class UserModel extends Model {
  @hasMany('document') documents;
  @hasMany('document-group') documentGroups;
  @hasMany('device') devices;
  @hasMany('invoice') invoices;
  @hasMany('payment-method', { polymorphic: true }) paymentMethods;
  @hasMany('payment') payments;
  @hasMany('property') properties;
  @belongsTo('promo-code') promoCode;
  @belongsTo('subscription') subscription;

  @attr('string') email;
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') phoneNumber;

  @attr('string') requestedZipcode;
  @attr('write-only') password;

  @attr('date') createdAt;
  @attr('date') updatedAt;

  // An HMAC signed hash of the user id.
  // Required for Intercom Identify Verification
  // @see https://developers.intercom.com/installing-intercom/docs/cordova-phonegap-identity-verification
  @attr('string') intercomHash;

  @attr('string') contactType;
  @attr('string') onboardingStep;
  @attr('string') onboardingCode;

  @attr('string') howDidYouHearAboutUs;

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get shouldResumeOnboarding() {
    return isPresent(this.onboardingStep) && this.onboardingStep !== COMPLETED;
  }

  get shouldContinueOnboarding() {
    return isEmpty(this.onboardingStep);
  }
}
