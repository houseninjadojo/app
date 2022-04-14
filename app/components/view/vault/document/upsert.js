import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inputValidation } from 'houseninja/utils/components/input-validation';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { Capacitor } from '@capacitor/core';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';
import { isPresent } from '@ember/utils';
import { Filesystem } from '@capacitor/filesystem';
import base64ToBlob from 'houseninja/utils/base64-to-blob';
import { debug } from '@ember/debug';
import { captureException } from 'houseninja/utils/sentry';

// import { Camera, CameraResultType } from '@capacitor/camera';

export default class VaultDocumentUpsertComponent extends Component {
  @service activeStorage;
  @service camera;
  @service current;
  @service file;
  @service haptics;
  @service router;
  @service view;

  @tracked formIsInvalid = true;
  @tracked newDocument = this.camera.image ?? this.file.file;
  @tracked documentUrl = this._getThumbnailUrl();

  @tracked uploadProgress = 0;

  @tracked documentInfo = {
    name: this._getFilename(),
    description: this.args.model.document?.get('description') ?? null,
    documentGroup: this.args.model.document?.get('group.id') ?? null,
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
      id: 'documentGroup',
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
              this.args.model.document?.get('group') &&
              this.args.model.document?.get('group.id') &&
              g.id === this.args.model.document?.get('group.id'),
          };
        }),
      ],
      value: this.args.model.document?.get('group.id'),
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
  async delete() {
    const response = await this.confirm();
    const { index } = response;
    const confirmed = this.options[index].title === this.options[1].title;
    const { document } = this.args.model;

    if (confirmed) {
      try {
        debug('Deleting group...');
        debug('Update all associated documents groupId to null or empty');

        await document.destroyRecord();

        this.router.transitionTo(NATIVE_MOBILE_ROUTE.VAULT.INDEX);
      } catch (e) {
        captureException(e);
      }
    }
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

  get document() {
    return this.args.model.document;
  }

  get selectedDocumentGroup() {
    return this.args.model.groups.findBy('id', this.documentInfo.documentGroup);
  }

  @action
  async save() {
    // @todo put all of this in try/catch blocks
    if (this.newDocument) {
      debug('Saving new document...');
      const contents = await Filesystem.readFile({
        path: this.newDocument.path,
      });
      const blob = base64ToBlob(
        contents.data,
        `image/${this.newDocument.format}`
      );
      const file = new File([blob], this.documentInfo.name, {
        type: `image/${this.newDocument.format}`,
      });
      const uploadedFile = await this.activeStorage.upload(file, {
        onProgress: (progress /*, event */) => {
          this.uploadProgress = progress;
        },
      });
      this.args.model.document.setProperties({
        name: this.documentInfo.name,
        description: this.documentInfo.description,
        asset: uploadedFile.signedId,
        documentGroup: this.selectedDocumentGroup,
        user: this.current.user,
      });
      await this.args.model.document?.save();
      await this.args.model.document?.reload();
      this.router.transitionTo(
        NATIVE_MOBILE_ROUTE.VAULT.DOCUMENTS.SHOW,
        this.document.id
      );
    } else {
      this.args.model.document.setProperties({
        documentGroup: this.selectedDocumentGroup,
        description: this.documentInfo.description,
        name: this.documentInfo.name,
      });
      await this.args.model.document?.save();
      this.router.transitionTo(
        NATIVE_MOBILE_ROUTE.VAULT.DOCUMENTS.SHOW,
        this.document.id
      );
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
    this.documentInfo.name = this.args.model.document?.name || this.documentUrl;
    this.documentInfo.description =
      this.args.model.document?.description || null;
    this.documentInfo.documentGroup =
      this.args.model.document?.get('group.id') || null;

    this.camera.image && this.camera.clear();
    this.file.file && this.file.clear();
    this.formIsInvalid = true;

    if (isPresent(this.document) && this.document.isNew) {
      this.document.unloadRecord();
    }
  }

  @action
  validateForm(e) {
    this.documentInfo[e.target.id] = e.target.value;
    this.fields.filter((f) => f.id === e.target.id)[0].value =
      this.documentInfo[e.target.id];

    this.formIsInvalid = inputValidation(this.fields, []).isInvalid;
  }
}
