declare module 'ember-data/types/registries/model' {
  // catch all for ember-data
  export default interface ModelRegistry {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
}
