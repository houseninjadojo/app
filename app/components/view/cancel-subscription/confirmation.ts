import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { captureException } from 'houseninja/utils/sentry';
import { runInDebug } from '@ember/debug';

import SessionService from 'houseninja/services/session';
import StoreService from 'houseninja/services/store';

export default class CancelSubscriptionConfirmationViewComponent extends Component {
  @service declare session: SessionService;
  @service declare store: StoreService;

  @tracked surveyOptions = [
    {
      label: "I'm moving",
      value: 'moving',
      checked: false,
    },
    {
      label: "I don't need this service anymore",
      value: 'unnecessary',
      checked: false,
    },
    {
      label: 'This service is too expensive',
      value: 'too expensive',
      checked: false,
    },
    {
      label: 'I had issues with my service',
      value: 'had issues',
      checked: false,
    },
    {
      label: 'Other',
      value: 'other',
      checked: false,
    },
  ];

  @tracked additionalFeedback = '';

  @action
  goodbye(): void {
    this.session.invalidate();
  }

  @action
  handleSurveyChange({ value }: { value: string }): void {
    this.surveyOptions = this.surveyOptions.map((o) => {
      if (o.value === value && !o.checked) {
        o.checked = true;
      } else {
        o.checked = false;
      }

      return { ...o };
    });
  }

  @action
  handleTextAreaInput(e: InputEvent): void {
    const target = e.target as HTMLTextAreaElement;
    this.additionalFeedback = target.value;
  }

  @action
  handleSubmit(): void {
    const reason = this.surveyOptions.find((o) => o.checked);
    this.additionalFeedback;

    if (reason) {
      try {
        runInDebug(() => {
          console.log('Saving survey...', {
            reason: reason,
            additionalFeedback: this.additionalFeedback,
          });
        });
      } catch (e) {
        captureException(e as Error);
      } finally {
        this.goodbye();
      }
    }
  }
}
