import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { formatCreditCardNumber } from 'houseninja/utils/components/formatting';
import { captureException } from 'houseninja/utils/sentry';
import RouterService from '@ember/routing/router-service';
import ViewService from 'houseninja/services/view';
import StoreService from 'houseninja/services/store';
import CurrentService from 'houseninja/services/current';
import { Field } from 'houseninja/app/components';
import CreditCard from 'houseninja/models/credit-card';

type PMITarget = 'cardNumber' | 'cvv' | 'expMonth' | 'expYear' | 'zipcode';

export default class SettingsPaymentMethodsEditController extends Controller {
  declare model: CreditCard;

  @service declare router: RouterService;
  @service declare view: ViewService;
  @service declare store: StoreService;
  @service declare current: CurrentService;

  @tracked formIsInvalid = true;

  get fields(): Field[] {
    return [
      {
        id: 'cardNumber',
        required: true,
        label: 'Card Number',
        placeholder: '',
        disabled: true,
      },
      {
        // type: 'number',
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
  }

  @action
  handleInput(e: InputEvent) {
    const target = e.target as HTMLInputElement;
    const targetId = target.id as PMITarget;
    if (targetId !== 'cardNumber') {
      this.model.set(targetId, target.value);
    }

    this.__validateForm();
  }

  @action
  async saveAction() {
    const model = this.store.createRecord('credit-card', {
      ...this.model,
      user: this.current?.user,
    });
    try {
      await model.save();
      this.view.transitionToPreviousRoute();
    } catch (e) {
      captureException(e as Error);
    }
  }

  @action
  handleSetAsDefault(): void {
    this.model.isDefault = !this.model.isDefault;

    this.__validateForm();
  }

  @action
  async handleRemoveAction(): Promise<void> {
    const actionSheetOptions = [
      {
        title: 'Keep this payment method',
        style: ActionSheetButtonStyle.Cancel,
      },
      {
        title: 'Remove this payment method',
        style: ActionSheetButtonStyle.Destructive,
      },
    ];

    const result = await ActionSheet.showActions({
      title: `Are you sure you want to remove this payment method?`,
      options: actionSheetOptions,
    });

    const choice = actionSheetOptions[result.index]?.title;
    const confirmed = choice === actionSheetOptions[1]?.title;

    if (confirmed) {
      try {
        await this.model.destroyRecord();
        this.view.transitionToPreviousRoute();
      } catch (e) {
        captureException(e as Error);
      }
    }
  }

  @action
  resetForm(): void {
    this.formIsInvalid = true;
  }

  __validateForm(): void {
    const fields: Field[] = this.fields.map((f) => {
      if (f.id === 'cardNumber') {
        return {
          ...f,
          value: formatCreditCardNumber(this.model.cardNumber),
        };
      } else if (f.id === 'cvv') {
        return {
          ...f,
          value: this.model.cvv,
        };
      } else {
        return {
          ...f,
          value: this.model.get(f.id as PMITarget),
        };
      }
    });

    this.formIsInvalid = inputValidation(fields, ['cardIsValid']).isInvalid;
  }
}
