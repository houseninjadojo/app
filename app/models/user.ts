import Model, {
  attr,
  hasMany,
  belongsTo,
  AsyncHasMany,
  AsyncBelongsTo,
} from '@ember-data/model';
import { OnboardingStep } from 'houseninja/data/enums/onboarding-step';
import { isEmpty } from '@ember/utils';

import type Device from './device';
import type Document from './document';
import type DocumentGroup from './document-group';
import type Invoice from './invoice';
import type PaymentMethod from './payment-method';
import type Payment from './payment';
import type Property from './property';
import type PromoCode from './promo-code';
import type Subscription from './subscription';

export default class User extends Model {
  @hasMany('document', { async: true, inverse: 'user' })
  declare documents: AsyncHasMany<Document>;

  @hasMany('document-group', { async: true, inverse: 'user' })
  declare documentGroups: AsyncHasMany<DocumentGroup>;

  @hasMany('device', { async: true, inverse: 'user' })
  declare devices: AsyncHasMany<Device>;

  @hasMany('invoice', { async: true, inverse: 'user' })
  declare invoices: AsyncHasMany<Invoice>;

  @hasMany('payment-method', {
    async: true,
    inverse: 'user',
    polymorphic: true,
  })
  declare paymentMethods: AsyncHasMany<PaymentMethod>;

  @hasMany('payment', { async: true, inverse: 'user' })
  declare payments: AsyncHasMany<Payment>;

  @hasMany('property', { async: true, inverse: 'user' })
  declare properties: AsyncHasMany<Property>;

  @belongsTo('promo-code', { async: true, inverse: 'users' })
  declare promoCode: AsyncBelongsTo<PromoCode>;

  @belongsTo('subscription', { async: true, inverse: 'user' })
  declare subscription: AsyncBelongsTo<Subscription>;

  @attr('string') declare email: string;
  @attr('string') declare firstName: string;
  @attr('string') declare lastName: string;
  @attr('string') declare phoneNumber: string;

  @attr('string') declare requestedZipcode?: string;
  @attr('write-only') declare password?: string;

  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;

  // An HMAC signed hash of the user id.
  // Required for Intercom Identify Verification
  // @see https://developers.intercom.com/installing-intercom/docs/cordova-phonegap-identity-verification
  @attr('string') declare intercomHash?: string;

  @attr('string') declare contactType?: string;
  @attr('string') declare onboardingCode?: string;
  @attr('string', { defaultValue: OnboardingStep.ServiceArea })
  declare onboardingStep: OnboardingStep;

  @attr('string') declare howDidYouHearAboutUs?: string;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get shouldResumeOnboarding(): boolean {
    return this.onboardingStep !== OnboardingStep.Completed;
  }

  get shouldContinueOnboarding(): boolean {
    return isEmpty(this.onboardingStep);
  }

  get metricsParams(): { [key: string]: string | undefined } {
    return {
      distinctId: this.id,
      email: this.email,
      name: this.fullName,
      hmac: this.intercomHash,
    };
  }
}
