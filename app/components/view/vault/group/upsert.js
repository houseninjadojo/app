import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { debug } from '@ember/debug';
import { isPresent } from '@ember/utils';
import { captureException } from 'houseninja/utils/sentry';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class VaultGroupUpsertComponent extends Component {
  @service haptics;
  @service router;
  @service store;
  @service view;

  @tracked formIsInvalid = true;

  @tracked groupInfo = {
    name: this.args.model?.name,
    description: this.args.model?.description,
  };

  @tracked fields = [
    {
      id: 'name',
      required: true,
      label: 'Name',
      placeholder: '',
      value: this.groupInfo.name,
    },
    {
      id: 'description',
      required: false,
      label: 'Description',
      placeholder: '(Optional)',
      value: this.groupInfo.description,
    },
  ];

  options = [
    {
      title: 'Keep this category',
      style: ActionSheetButtonStyle.Cancel,
    },
    {
      title: 'Delete this category',
      style: ActionSheetButtonStyle.Destructive,
    },
  ];

  @action
  async delete() {
    const response = await this.confirm();
    const { index } = response;
    const confirmed = this.options[index].title === this.options[1].title;
    const group = this.args?.model;

    if (confirmed) {
      try {
        debug('Deleting group...');
        debug('Update all associated documents groupId to null or empty');

        await group.destroyRecord();

        this.router.transitionTo(NATIVE_MOBILE_ROUTE.VAULT.INDEX);
      } catch (e) {
        captureException(e);
      }
    }
  }

  @action
  save() {
    if (this.formIsInvalid) {
      this.haptics.impact({ style: 'heavy' });
      return;
    }

    if (isPresent(this.args.model)) {
      this.args.model.name = this.groupInfo.name;
      this.args.model.description = this.groupInfo.description;
      this.args.model.save();
    } else {
      let group = this.store.createRecord('document-group', {
        name: this.groupInfo.name,
        description: this.groupInfo.description,
      });
      group.save();
    }

    this.view.transitionToPreviousRoute();
  }

  @action
  async confirm() {
    const result = await ActionSheet.showActions({
      title: 'You are about to delete this category.',
      message: 'What would you like to do?',
      options: this.options,
    });
    return result;
  }

  @action
  resetForm() {
    this.groupInfo.name = this.args.model.name;
    this.groupInfo.description = this.args.model.description;
    this.groupInfo.documentGroup = this.args.model.document.group.id;
    this.args.model?.rollbackAttributes();
    this.formIsInvalid = true;
  }

  @action
  validateForm(e) {
    this.groupInfo[e.target.id] = e.target.value;
    this.fields.filter((f) => f.id === e.target.id)[0].value =
      this.groupInfo[e.target.id];

    this.formIsInvalid = inputValidation(this.fields, []).isInvalid;
  }
}
