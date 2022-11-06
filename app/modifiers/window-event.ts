import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

type HandlerFn = (data: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
type ModOpts = [event: string, handler: HandlerFn];

interface ModSig {
  Args: {
    Positional: ModOpts;
    Named: object;
  };
}

const cleanup = (instance: WindowEventModifier): void => {
  let { event, handler } = instance;

  if (event && handler) {
    window.removeEventListener(event, handler);
    event = undefined;
    handler = undefined;
  }
};

export default class WindowEventModifier extends Modifier<ModSig> {
  event?: string;
  handler?: HandlerFn;

  modify(element: Element, [event, handler]: ModOpts): void {
    this.addEventListener(event, handler);
    registerDestructor(this, cleanup);
  }

  addEventListener = (event: string, handler: HandlerFn): void => {
    this.event = event;
    this.handler = handler;
    window.addEventListener(event, handler);
  };
}
