import { default as BaseMetricsService } from 'ember-metrics/services/metrics';

export default class MetricsService extends BaseMetricsService {
  async reset(): Promise<void> {
    this.context = {};
    this.invoke('reset');
  }
}
