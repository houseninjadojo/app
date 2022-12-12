import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isBlank } from '@ember/utils';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import CurrentService from 'houseninja/services/current';
import IntercomService from 'houseninja/services/intercom';
import RouterService from '@ember/routing/router-service';
import ViewService from 'houseninja/services/view';
import Property from 'houseninja/models/property';
import { Field } from 'houseninja/app/components';
import { debug } from '@ember/debug';
import { runTask } from 'ember-lifeline';

type PropertyTargets =
  | 'streetAddress1'
  | 'streetAddress2'
  | 'city'
  | 'state'
  | 'zipcode';

export default class SettingsPropertyController extends Controller {
  declare model: Property;

  @service declare current: CurrentService;
  @service declare intercom: IntercomService;
  @service declare router: RouterService;
  @service declare view: ViewService;

  @tracked showPropertyDialog = false;

  @tracked formIsInvalid = true;

  @tracked propertyInfo = {
    streetAddress1: this.model?.streetAddress1,
    streetAddress2: this.model?.streetAddress2,
    city: this.model?.city,
    state: this.model?.state,
    zipcode: this.model?.zipcode,
  };

  @tracked fields: Field[] = [
    {
      id: 'streetAddress1',
      required: true,
      label: 'Street Address 1',
      placeholder: '',
      value: (this.model && this.model.streetAddress1) || undefined,
    },
    {
      id: 'streetAddress2',
      required: false,
      label: 'Street Address 2',
      placeholder: '(Optional)',
      value: (this.model && this.model.streetAddress2) || undefined,
    },
    {
      id: 'city',
      required: true,
      label: 'City',
      placeholder: '',
      disabled: false,
      value: (this.model && this.model.city) || undefined,
    },
    {
      isSelect: true,
      id: 'state',
      required: true,
      label: 'State',
      placeholder: '',
      options: [{ value: 'TX', label: 'TX', selected: true }],
      disabled: true,
      value: (this.model && this.model.state) || undefined,
    },
    {
      // type: 'number',
      id: 'zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
      value: (this.model && this.model.zipcode) || undefined,
    },
  ];

  @action
  shouldShowPropertyDialog(): void {
    if (isBlank(this.current?.property?.streetAddress1)) {
      runTask(this, this.toggleModal, 500);
    }
  }

  @action
  toggleModal(): void {
    this.showPropertyDialog = !this.showPropertyDialog;
  }

  @action
  resetForm(): void {
    if (this.model) {
      this.propertyInfo.streetAddress1 = this.model?.streetAddress1;
      this.propertyInfo.streetAddress2 = this.model?.streetAddress2;
      this.propertyInfo.city = this.model?.city;
      this.propertyInfo.state = this.model?.state;
      this.propertyInfo.zipcode = this.model?.zipcode;
    }

    this.formIsInvalid = true;
  }

  @action
  validateForm(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    const targetId = target.id as PropertyTargets;
    this.propertyInfo[targetId] = target.value.trim();
    const field = this.fields.find((f) => f.id === targetId);
    if (field) field.value = this.propertyInfo[targetId];

    this.formIsInvalid = inputValidation(this.fields, [
      'zipcodeIsValid',
    ]).isInvalid;
  }

  @action
  handleSelect(e: InputEvent): void {
    debug(e.toString());
  }

  @action
  async showMessenger(): Promise<void> {
    this.intercom.showComposer(
      'Hello. I need to make a change to my property address.'
    );
  }
}
