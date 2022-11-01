import { default as BaseMetricsService } from 'ember-metrics/services/metrics';

export default class MetricsService extends BaseMetricsService {
  reset(): void {
    this.context = {};
    this.invoke('reset');
  }
}
