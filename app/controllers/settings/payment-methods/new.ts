import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { formatCreditCardNumberElement } from 'houseninja/utils/components/formatting';
import { captureException } from 'houseninja/utils/sentry';
import { TrackedArray, TrackedObject } from 'tracked-built-ins';
import RouterService from '@ember/routing/router-service';
import ViewService from 'houseninja/services/view';
import StoreService from 'houseninja/services/store';
import CurrentService from 'houseninja/services/current';
import { Field } from 'houseninja/app/components';

type PMITarget = 'cardNumber' | 'cvv' | 'expMonth' | 'expYear' | 'zipcode';
type PaymentMethodInfo = {
  cardNumber?: string;
  cvv?: string;
  expMonth?: string;
  expYear?: string;
  zipcode?: string;
  isDefault?: boolean;
};

export default class SettingsPaymentMethodsNewController extends Controller {
  @service declare router: RouterService;
  @service declare view: ViewService;
  @service declare store: StoreService;
  @service declare current: CurrentService;

  @tracked formIsInvalid = true;
  paymentMethod: PaymentMethodInfo = new TrackedObject({
    cardNumber: undefined,
    cvv: undefined,
    expMonth: undefined,
    expYear: undefined,
    zipcode: undefined,
    isDefault: false,
  });
  fields: Field[] = new TrackedArray([
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
  ]);

  @action
  resetForm(): void {
    this.fields.forEach((f) => (f.value = null));
    this.paymentMethod.cardNumber = undefined;
    this.paymentMethod.cvv = undefined;
    this.paymentMethod.expMonth = undefined;
    this.paymentMethod.expYear = undefined;
    this.paymentMethod.zipcode = undefined;
    this.paymentMethod.isDefault = false;
    this.formIsInvalid = true;
  }

  @action
  handleInput(e: InputEvent): void {
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

    this.__validateForm();
  }

  @action
  async saveAction(): Promise<void> {
    const model = this.store.createRecord('credit-card', {
      ...this.paymentMethod,
      user: this.current?.user,
    });
    try {
      await model.save();
      await this.resetForm();
      this.view.transitionToPreviousRoute();
    } catch (e) {
      captureException(e as Error);
    }
  }

  @action
  handleSetAsDefault(): void {
    this.paymentMethod.isDefault = !this.paymentMethod.isDefault;
    this.paymentMethod = { ...this.paymentMethod };

    this.__validateForm();
  }

  __validateForm(): void {
    const fields = this.fields.map((f) => {
      return {
        ...f,
      };
    });
    this.formIsInvalid = inputValidation(fields, ['cardIsValid']).isInvalid;
  }
}
