import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';

// import { Camera, CameraResultType } from '@capacitor/camera';

export default class VaultDocumentUpsertComponent extends Component {
  @service camera;
  @service haptics;
  @service router;
  @service view;

  @tracked formIsInvalid = true;
  @tracked media = this.camera.image;
  @tracked mediaUrl =
    this.args.model.document.url || (this.media && this.media.webPath);

  @tracked documentInfo = {
    name: this.args.model.document.name || this.mediaUrl,
    description: this.args.model.document.description || null,
    documentGroup: this.args.model.document.groupId || null,
  };

  @tracked fields = [
    {
      id: 'name',
      required: true,
      label: 'Name',
      placeholder: '',
      value: this.documentInfo.name,
    },
    {
      id: 'description',
      required: false,
      label: 'Description',
      placeholder: '(Optional)',
      value: this.documentInfo.description,
    },
    {
      isSelect: true,
      id: 'document-group',
      required: false,
      label: 'Category',
      placeholder: '',
      options: [
        { value: null, label: 'Uncategorized', selected: true },
        ...this.args.model.groups.map((g) => {
          return {
            value: g.id,
            label: g.name,
            selected:
              this.args.model.document &&
              this.args.model.document.groupId &&
              g.id === this.args.model.document.groupId,
          };
        }),
      ],
      value: this.args.model.document && this.args.model.document.groupId,
    },
  ];

  options = [
    {
      title: 'Keep this document',
      style: ActionSheetButtonStyle.Cancel,
    },
    {
      title: 'Delete this document',
      style: ActionSheetButtonStyle.Destructive,
    },
  ];

  @action
  delete() {
    const response = this.confirm();
  }

  @action
  async confirm() {
    const result = await ActionSheet.showActions({
      title: 'You are about to delete this document.',
      message: 'What would you like to do?',
      options: this.options,
    });
    return result;
  }

  @action
  resetForm() {
    this.documentInfo.name = this.args.model.document.name || this.mediaUrl;
    this.documentInfo.description =
      this.args.model.document.description || null;
    this.documentInfo.documentGroup = this.args.model.document.groupId || null;
    this.formIsInvalid = true;
  }

  @action
  validateForm(e) {
    this.documentInfo[e.target.id] = e.target.value;
    this.fields.filter((f) => f.id === e.target.id)[0].value =
      this.documentInfo[e.target.id];

    this.formIsInvalid = inputValidation(this.fields, []).isInvalid;
  }
}
