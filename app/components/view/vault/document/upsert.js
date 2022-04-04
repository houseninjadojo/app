import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { Capacitor } from '@capacitor/core';

// import { Camera, CameraResultType } from '@capacitor/camera';

export default class VaultDocumentUpsertComponent extends Component {
  @service camera;
  @service file;
  @service haptics;
  @service router;
  @service view;

  @tracked formIsInvalid = true;
  @tracked newDocument = this.camera.image ?? this.file.file;
  @tracked documentUrl = this._getThumbnailUrl();

  @tracked documentInfo = {
    name: this._getFilename(),
    description: this.args.model.document.description ?? null,
    documentGroup: this.args.model.document.groupId ?? null,
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

  _getThumbnailUrl() {
    let path = '';

    if (this.file.file?.path) {
      path = Capacitor.convertFileSrc(this.file.file.path);
    } else {
      path = this.camera.image?.webPath ?? this.args.model.document?.url;
    }

    return path;
  }

  _getFilename() {
    let name = '';

    if (this.file.file?.name) {
      name = this.file.file.name;
    } else if (this.camera.image) {
      const webPath = this.camera.image.webPath;
      const subStringSearch = '/tmp/';
      const startingIndex =
        webPath.indexOf(subStringSearch) + subStringSearch.length;

      name = this.camera.image.webPath.substring(startingIndex, webPath.length);
    } else {
      name = this.args.model.document?.name;
    }

    return name;
  }

  @action
  save() {
    if (this.newDocument) {
      console.log('Saving new document...');
    } else {
      console.log('Updating new document...');
    }
    this.resetForm();
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
    this.documentInfo.name = this.args.model.document.name || this.documentUrl;
    this.documentInfo.description =
      this.args.model.document.description || null;
    this.documentInfo.documentGroup = this.args.model.document.groupId || null;

    this.camera.image && this.camera.clear();
    this.file.file && this.file.clear();
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
