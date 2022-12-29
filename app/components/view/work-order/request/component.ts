import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import RouterService from '@ember/routing/router-service';
import type Detail from 'houseninja/models/service-category';
import type ServiceCategoryModel from 'houseninja/models/service-category';

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

type ImageUri = string;

interface Request {
  priority: ServiceTimingPriority | null;
  category: ServiceCategoryModel | null;
  detail: Detail | null;
  additional: string;
  images: Array<ImageUri>;
}

type Args = {
  model: Array<ServiceCategoryModel>;
};

export default class WorkOrderViewComponent extends Component<Args> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare loader: any;
  @service declare router: RouterService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare view: any;

  @tracked currentStep: RequestStep = 1;
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
      // 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1144982182.jpg?crop=0.669xw:1.00xh;0.166xw,0&resize=1200:*',
      // 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1144982182.jpg?crop=0.669xw:1.00xh;0.166xw,0&resize=1200:*',
      // 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1144982182.jpg?crop=0.669xw:1.00xh;0.166xw,0&resize=1200:*',
    ],
  };
  @tracked selectedCategory: ServiceCategoryModel | null = null;

  timingPriorities = [
    ServiceTimingPriority.Urgently,
    ServiceTimingPriority.NextWeek,
    ServiceTimingPriority.ThisMonth,
    ServiceTimingPriority.JustEstimate,
  ];

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

    // this.incrementStep();
  }

  @action
  handleAdditionalChange(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    this.request['additional'] = target.value;
    this.updateRequestObj();

    // this.incrementStep();
  }

  @action
  handleSubmit(): void {
    //SUBMIT REQUEST
    console.log(this.request);
  }

  @action
  handleNevermindClick(): void {
    this.view.transitionToPreviousRoute();
  }
}
