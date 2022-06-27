import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CancelSubscriptionConfirmationViewComponent extends Component {
  @service session;
  @service store;

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
  selectRoute() {
    this.session.terminate();
  }

  @action
  handleSurveyChange({ value }) {
    this.surveyOptions = this.surveyOptions.map((o) => {
      if (o.value === value && !o.checked) {
        o.checked = true;
      } else {
        o.checked = false;
      }

      return { ...o };
    });

    console.log(this.surveyOptions);
  }

  @action
  handleTextAreaInput(e) {
    this.additionalFeedback = e.target.value;
  }
}
