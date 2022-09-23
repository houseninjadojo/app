import Service from '@ember/service';

export default interface UserActivityService extends Service {
  on(
    eventName: string,
    context: ThisType<UserActivityService>,
    callbackFn: (event: TouchEvent) => Promise<void>
  ): void;
  off(eventName: string): void;
  has(eventName: string): boolean;
  handleEvent(event: Event): void;
  enableEvent(eventName: string): void;
  disableEvent(eventName: string): void;
  fireEvent(event: Event): void;
  isEnabled(eventName: string): boolean;
}
