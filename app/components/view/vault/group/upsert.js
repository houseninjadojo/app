import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';

export default class VaultGroupUpsertComponent extends Component {
  @service haptics;
  @service router;
  @service view;

  @tracked formIsInvalid = true;

  @tracked groupInfo = {
    name: this.args.model.name,
    description: this.args.model.description,
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

    if (confirmed) {
      try {
        console.log('Deleting group...');
        console.log('Update all associated documents groupId to null or empty');
        this.view.transitionToPreviousRoute();
      } catch (e) {
        console.log(e);
      }
    }
  }

  @action
  save() {
    console.log('Saving...');
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
    this.args.model.reload();
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
