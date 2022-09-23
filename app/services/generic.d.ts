import type Service from '@ember/service';

type GenericService = Service & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export default GenericService;
