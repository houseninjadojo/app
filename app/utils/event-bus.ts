import { dasherize } from '@ember/string';
import type { PluginListenerHandle } from '@capacitor/core';
import type {
  PluginInstance,
  ListenablePlugin,
} from 'houseninja/services/event-bus';

export const isPluginListener = (
  handler: any // eslint-disable-line @typescript-eslint/no-explicit-any
): handler is PluginListenerHandle => {
  return typeof handler?.remove === 'function';
};

export const isListenablePlugin = (
  plugin: any // eslint-disable-line @typescript-eslint/no-explicit-any
): plugin is PluginInstance & ListenablePlugin => {
  return typeof plugin.addListener === 'function';
};

export const getEventSlug = (pluginName: string, eventName: string): string => {
  return `${dasherize(pluginName)}.${dasherize(eventName)}`;
};
