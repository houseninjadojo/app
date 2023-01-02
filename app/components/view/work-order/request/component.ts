import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Filesystem } from '@capacitor/filesystem';
import RouterService from '@ember/routing/router-service';
import base64ToBlob from 'houseninja/utils/base64-to-blob';
import CameraService, { CameraSource, Photo } from 'houseninja/services/camera';
import LoaderService from 'houseninja/services/loader';
import ViewService from 'houseninja/services/view';
import type Detail from 'houseninja/models/service-category';
import type ServiceCategoryModel from 'houseninja/models/service-category';
import { debug } from '@ember/debug';

enum WorkOrderCreateViewContent {
  TimingPriority = 'timing-priority',
  SelectCategory = 'select-category',
  Details = 'details',
  Confirmed = 'confirmed',
}

enum RequestStep {
  Step1 = 1,
  Step2 = 2,
  Step3 = 3,
  Step4 = 4,
}

export enum ServiceTimingPriority {
  Urgently = 'Urgently',
  NextWeek = 'Next Week',
  ThisMonth = 'This Month',
  JustEstimate = 'I just want an estimate',
}

type ActiveStorageSignedId = string;
type ImageUri = string;

interface Request {
  priority: ServiceTimingPriority | null;
  category: ServiceCategoryModel | null;
  detail: Detail | null;
  additional: string;
  images: Array<ActiveStorageSignedId>;
}

interface ImageMenuOption {
  id: CameraSource.Camera | CameraSource.Photos;
  label: string;
  handleClick: (option: ImageMenuOption) => Promise<void>;
}

type Args = {
  model: Array<ServiceCategoryModel>;
};

export default class WorkOrderViewComponent extends Component<Args> {
  @service declare activeStorage: any;
  @service declare camera: CameraService;
  @service declare loader: LoaderService;
  @service declare router: RouterService;
  @service declare view: ViewService;

  @tracked currentStep: RequestStep = 3;
  @tracked request: Request = {
    priority: null,
    category: null,
    detail: null,
    additional: '',
    // images: [],
    images: [
      // 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1144982182.jpg',
      // 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg',
      // 'https://media.npr.org/assets/img/2021/08/11/gettyimages-1279899488_wide-f3860ceb0ef19643c335cb34df3fa1de166e2761.jpg',
    ],
  };
  @tracked images: Photo[] = [];
  @tracked imagePreviews: ImageUri[] = [];
  @tracked selectedCategory: ServiceCategoryModel | null = null;
  @tracked showImageSourceMenu = false;
  @tracked uploadProgress = 0;

  timingPriorities = [
    ServiceTimingPriority.Urgently,
    ServiceTimingPriority.NextWeek,
    ServiceTimingPriority.ThisMonth,
    ServiceTimingPriority.JustEstimate,
  ];

  get imageSourceOptions(): Array<ImageMenuOption> {
    return [
      {
        id: CameraSource.Camera,
        label: 'Take a Photo',
        handleClick: (option: ImageMenuOption) =>
          this.handleImageSourceSelection(option),
      },
      {
        id: CameraSource.Photos,
        label: 'Select from Photo Library',
        handleClick: (option: ImageMenuOption) =>
          this.handleImageSourceSelection(option),
      },
    ];
  }

  get categories(): ServiceCategoryModel[] {
    return this.args.model;
  }

  get isLoading() {
    return this.loader.isLoading;
  }

  get contentType(): string {
    switch (this.currentStep) {
      case RequestStep.Step1:
        return WorkOrderCreateViewContent.TimingPriority;
      case RequestStep.Step2:
        return WorkOrderCreateViewContent.SelectCategory;
      case RequestStep.Step3:
        return WorkOrderCreateViewContent.Details;
      case RequestStep.Step4:
        return WorkOrderCreateViewContent.Confirmed;
    }
  }

  private updateRequestObj(): void {
    this.request = { ...this.request };
  }

  private collectImageForPreview(image: Photo): void {
    if (image.webPath) {
      this.imagePreviews = [image.webPath, ...this.imagePreviews];
      this.images = [image, ...this.images];
    }
  }

  private getFileName(): string {
    let prefix = '';
    if (this.request.category) {
      prefix = this.request.category.name
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase())
        .join('-');
    }
    return `${prefix}-request-image-${this.request.images.length + 1}`;
  }

  private collectImageForStorage(image: ActiveStorageSignedId): void {
    this.request['images'] = [image, ...this.request['images']];
    this.updateRequestObj();
  }

  private async processImages(images: Array<Photo>): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    images.map(async (image) => {
      if (image.path && image.webPath) {
        const contents = await Filesystem.readFile({
          path: image.path,
        });
        const blob = base64ToBlob(contents.data, `image/${image.format}`);
        const file = new File([blob], this.getFileName(), {
          type: `image/${image.format}`,
        });

        try {
          const uploadedFile = await this.activeStorage.upload(file, {
            onProgress: (progress: any /*, event */) => {
              that.uploadProgress = progress;
            },
          });

          this.collectImageForStorage(uploadedFile.signedId);
        } catch (e: any) {
          debug(e);
        }
      }
    });
  }

  private async setCameraServiceImage(source: ImageMenuOption) {
    await this.camera.setCameraServiceImage(source.id);
    const image = this.camera.image;
    const webPath = image?.webPath;
    if (image) {
      webPath && this.collectImageForPreview(image);

      this.updateRequestObj();
      this.toggleImageSourceMenu();
    }
  }

  private async handleImageSourceSelection(option: ImageMenuOption) {
    this.setCameraServiceImage(option);
  }

  @action
  incrementStep(): void {
    this.currentStep = this.currentStep + 1;
  }

  @action
  decrementStep(): void {
    this.currentStep = this.currentStep - 1;
  }

  @action
  handleTimingPriorityClick(value: ServiceTimingPriority): void {
    this.incrementStep();

    this.request['priority'] = value;
    this.updateRequestObj();
  }

  @action
  handleCategoryClick(value: ServiceCategoryModel): void {
    this.request['category'] = value;
    this.updateRequestObj();
    this.incrementStep();
  }

  @action
  handleDetailChange(value: Detail): void {
    this.request['detail'] = value;
    this.updateRequestObj();
  }

  @action
  handleAdditionalChange(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    this.request['additional'] = target.value;
    this.updateRequestObj();
  }

  @action
  handleDiscardImage(imageUri: ImageUri): void {
    this.imagePreviews = this.imagePreviews.filter((uri) => uri !== imageUri);
    this.images = this.images.filter((i) => i.webPath !== imageUri);
    this.updateRequestObj();
  }

  @action
  toggleImageSourceMenu(): void {
    this.showImageSourceMenu = !this.showImageSourceMenu;
  }

  @action
  async handleSubmit(): Promise<void> {
    console.log(this.request);
    // await this.processImages(this.images);
  }

  @action
  handleNevermindClick(): void {
    this.view.transitionToPreviousRoute();
  }
}
