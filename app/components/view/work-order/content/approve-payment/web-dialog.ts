import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { captureException } from 'houseninja/utils/sentry';
import { formatCreditCardNumberElement } from 'houseninja/utils/components/formatting';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { TrackedObject } from 'tracked-built-ins';
import { APP_STORE_URL } from 'houseninja/data/app';

import type { FieldSet } from 'houseninja/app/components';
import type RouterService from '@ember/routing/router-service';
import type StoreService from '@ember-data/store';
import type PaymentMethod from 'houseninja/models/payment-method';
import type ToastService from 'houseninja/services/toast';
import type User from 'houseninja/models/user';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import DS from 'ember-data';

type PaymentMethodInfo = {
  cardNumber?: string;
  cvv?: string;
  expMonth?: string;
  expYear?: string;
  zipcode?: string;
};
type PMITarget = 'cardNumber' | 'cvv' | 'expMonth' | 'expYear' | 'zipcode';

type Args = {
  approvePayment: () => void;
};

type Errors =
  | DS.Errors
  | {
      cardNumber?: DS.InvalidError[];
      cvv?: DS.InvalidError[];
      expMonth?: DS.InvalidError[];
      expYear?: DS.InvalidError[];
      zipcode?: DS.InvalidError[];
    };

export default class WorkOrderApprovePaymentWebDialogViewContentComponent extends Component<Args> {
  @service declare router: RouterService;
  @service declare store: StoreService;
  @service declare toast: ToastService;

  @tracked paymentMethodFormIsInvalid = true;
  paymentMethod: PaymentMethodInfo = new TrackedObject({
    cardNumber: undefined,
    cvv: undefined,
    expMonth: undefined,
    expYear: undefined,
    zipcode: undefined,
  });
  errors: Errors | undefined = new TrackedObject({
    cardNumber: [],
    cvv: [],
    expMonth: [],
    expYear: [],
    zipcode: [],
  });

  fields: FieldSet = [
    {
      id: 'cardNumber',
      required: true,
      label: 'Card Number',
      placeholder: '',
    },
    {
      type: 'number',
      id: 'cvv',
      required: true,
      label: 'Security Code',
      placeholder: '',
    },
    {
      type: 'number',
      id: 'expMonth',
      required: true,
      label: 'Month',
      placeholder: 'MM',
    },
    {
      type: 'number',
      id: 'expYear',
      required: true,
      label: 'Year',
      placeholder: 'YY',
    },
    {
      type: 'number',
      id: 'zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
    },
  ];

  @action
  validatePaymentMethodForm(e: Event): void {
    const target = e.target as HTMLInputElement;
    const targetId: PMITarget = target.id as PMITarget;
    const field = this.fields.find((f) => f.id === targetId);
    if (targetId === 'cardNumber') {
      target.value = target.value.replace(/\D/g, '');
      formatCreditCardNumberElement(target);
      this.paymentMethod.cardNumber = target.value;
    } else {
      this.paymentMethod[targetId] = target.value;
    }

    // Update the field presentation regardless for actual validation
    if (field) field.value = target.value;

    this.paymentMethodFormIsInvalid = inputValidation(this.fields, [
      'cardIsValid',
    ]).isInvalid;
  }

  @action
  async updatePaymentMethod(): Promise<void> {
    const paymentMethod: PaymentMethod = this.store.createRecord(
      'credit-card',
      {
        ...this.paymentMethod,
        user: this.user,
      }
    );
    try {
      await paymentMethod.save();
      await this.args.approvePayment();
    } catch (e) {
      if (!paymentMethod.errors.isEmpty) {
        this.errors = paymentMethod.errors;
        const hasGenericError = this.errors.has('base');
        if (hasGenericError) {
          this.toast.showError(
            'There was an issue while verifying your payment method. If this happens again, please contact us at hello@houseninja.co.'
          );
        }
      }
      captureException(e as Error);
    }
  }

  @action
  downloadFromAppStore(): void {
    window.open(APP_STORE_URL, '_blank');
  }

  get user(): User {
    return this.store.peekAll('user').firstObject;
  }
}
