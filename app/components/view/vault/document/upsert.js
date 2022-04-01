import Component from '@glimmer/component';
import { service } from '@ember/service';
// import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

// import { Camera, CameraResultType } from '@capacitor/camera';

export default class VaultDocumentUpsertComponent extends Component {
  @service camera;
  @service haptics;
  @service router;
  @service view;

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
}
