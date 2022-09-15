import Model, { attr } from '@ember-data/model';

export default class HomeCareTipModel extends Model {
  @attr('string') declare label: string;
  @attr('string') declare description: string;
  @attr('string') declare defaultHnChatMessage?: string;
  @attr('string') declare timeOfYear?: string;
  @attr('string') declare serviceProvider?: string;
  @attr('string') declare otherProvider?: string;
  @attr('boolean', { defaultValue: false }) declare showButton: boolean;
}
