import Handler from 'houseninja/lib/event-bus/handler';
import { TrackedMap } from 'tracked-built-ins';

/**
 * Manager
 *
 * A manager is responsible for managing a collection of handlers. It is
 * responsible for adding and removing handlers.
 */
export default class Manager {
  private handlers = new TrackedMap<string, Handler>();

  addHandler(eventSlug: string, handler: Handler): void {
    if (this.handlers.has(eventSlug)) {
      this.handlers.get(eventSlug)?.remove();
    }
    this.handlers.set(eventSlug, handler);
  }

  removeHandler(eventSlug: string): void {
    this.handlers.get(eventSlug)?.remove();
    this.handlers.delete(eventSlug);
  }

  removeHandlers(): void {
    this.handlers.forEach((handler) => handler.remove());
    this.handlers.clear();
  }

  hasHandler(eventSlug: string): boolean {
    return this.handlers.has(eventSlug);
  }
}
