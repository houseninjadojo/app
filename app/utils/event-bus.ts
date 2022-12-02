import { dasherize } from '@ember/string';
import type { PluginListenerHandle } from '@capacitor/core';
import type {
  PluginInstance,
  ListenablePlugin,
  ListenableWindow,
} from 'houseninja/services/event-bus';

export const isPluginListener = (
  handler: any // eslint-disable-line @typescript-eslint/no-explicit-any
): handler is PluginListenerHandle => {
  return typeof handler?.remove === 'function';
};

export const isWindowListener = (
  handler: any // eslint-disable-line @typescript-eslint/no-explicit-any
): handler is Window & ListenableWindow => {
  return typeof handler?.removeEventListener === 'function';
};

export const isListenablePlugin = (
  plugin: any // eslint-disable-line @typescript-eslint/no-explicit-any
): plugin is PluginInstance & ListenablePlugin => {
  return typeof plugin.addListener === 'function';
};

export const isListenableWindow = (
  window: any // eslint-disable-line @typescript-eslint/no-explicit-any
): window is Window & ListenableWindow => {
  return typeof window.addEventListener === 'function';
};

export const getEventSlug = (pluginName: string, eventName: string): string => {
  return `${dasherize(pluginName)}.${dasherize(eventName)}`;
};
