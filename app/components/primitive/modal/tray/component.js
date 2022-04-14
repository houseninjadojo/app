import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { tracked } from '@glimmer/tracking';

export default class TrayComponent extends Component {
  @service router;
  @service view;

  @tracked isLoading = false;

  options = [
    {
      title: 'Save changes',
    },
    {
      title: 'Cancel',
      style: ActionSheetButtonStyle.Cancel,
    },
    {
      title: 'Discard changes',
      style: ActionSheetButtonStyle.Destructive,
    },
  ];

  @action
  async goBack() {
    if (this.args.formIsInvalid !== undefined && !this.args.formIsInvalid) {
      let result = await this.confirm();
      let choice = this.options[result.index].title;

      switch (choice) {
        case this.options[0].title:
          this.callSaveAction();
          this.view.transitionToPreviousRoute();
          this.args.onBack && this.args.onBack();
          break;
        case this.options[1].title:
          break;
        case this.options[2].title:
          this.view.transitionToPreviousRoute();
          this.args.onBack && this.args.onBack();
          break;
      }
    } else {
      this.view.transitionToPreviousRoute();
      this.args.onBack && this.args.onBack();
    }
  }

  @action
  async confirm() {
    const result = await ActionSheet.showActions({
      title: 'Unsaved changes',
      message: 'What would you like to do?',
      options: this.options,
    });
    return result;
  }

  @action
  async handlePrimaryClick() {
    this.isLoading = true;
    if (this.args.primaryAction) {
      this.args.primaryAction();
    } else if (!this.args.formIsInvalid && this.args.saveAction) {
      await this.args.saveAction();
    }
    this.isLoading = false;
  }
}
