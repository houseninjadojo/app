import Component from '@glimmer/component';
import { action } from '@ember/object';
import { assert } from '@ember/debug';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { captureException } from 'houseninja/utils/sentry';
import isNativePlatform from 'houseninja/utils/is-native-platform';

import type StoreService from '@ember-data/store';
import type Rating from 'houseninja/models/rating';
import type WorkOrder from 'houseninja/models/work-order';

// type RatingStep = 'vendor' | 'nps';
enum RatingStep {
  Vendor = 'vendor',
  Nps = 'nps',
  Finished = 'finished',
}
interface Args {
  workOrder: WorkOrder;
}
interface TextAreaCapture {
  vendor: string;
  nps: string;
}

export default class RatingsComponent extends Component<Args> {
  @service declare store: StoreService;

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    this.rating = this.store.createRecord('rating', {
      workOrder: this.args.workOrder,
    });
  }

  @tracked isProcessing = false;
  @tracked rating: Rating | undefined;
  @tracked step: RatingStep = RatingStep.Vendor;
  @tracked vendorRating: number | undefined;
  @tracked npsRating: number | undefined;
  @tracked textAreaCapture: TextAreaCapture = {
    vendor: '',
    nps: '',
  };

  @action
  handleVendorRating(e: InputEvent): void {
    assert(
      'handleVendorRating must be bound to an input element',
      e.target instanceof HTMLInputElement
    );
    this.vendorRating = parseInt(e.target.value);
  }

  @action
  handleNpsRating(e: InputEvent): void {
    assert(
      'handleNpsRating must be bound to an input element',
      e.target instanceof HTMLSelectElement
    );
    this.npsRating = parseInt(e.target.value);
  }

  @action
  handleTextAreaChange(e: InputEvent): void {
    assert(
      'handleTextAreaChange must be bound to an input element',
      e.target instanceof HTMLTextAreaElement
    );
    this.textAreaCapture[e.target.id as keyof TextAreaCapture] = e.target.value;
    this.textAreaCapture = { ...this.textAreaCapture };
  }

  @action
  async handleSubmit(): Promise<void> {
    this.isProcessing = true;
    if (this.rating) {
      this.rating.vendorRating = this.vendorRating;
      this.rating.npsRating = this.npsRating;
      this.rating.vendorTextAreaCapture = this.textAreaCapture.vendor;
      this.rating.npsTextAreaCapture = this.textAreaCapture.nps;

      try {
        await this.rating.save();
        this.nextStep();
      } catch (e) {
        captureException(e as Error);
      } finally {
        this.isProcessing = false;
      }
    }
  }

  nextStep(): void {
    if (this.step === RatingStep.Vendor) {
      this.step = RatingStep.Nps;
    } else if (this.step === RatingStep.Nps) {
      this.step = RatingStep.Finished;
    }
  }

  get isNativePlatform() {
    return isNativePlatform();
  }

  get formIsInvalid(): boolean {
    let isInvalid = true;

    if (this.step === RatingStep.Vendor) {
      isInvalid = !this.vendorRating;
    } else if (this.step === RatingStep.Nps) {
      isInvalid = !this.npsRating;
    }

    return isInvalid;
  }
}
