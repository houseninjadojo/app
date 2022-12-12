import Component from '@glimmer/component';
import { action } from '@ember/object';

type Args = {
  width: number;
  height: number;
  src: string;
};

export default class PrimitiveImageComponent extends Component<Args> {
  el?: HTMLImageElement;
  image?: HTMLImageElement;
  width: number;
  height: number;
  src: string;

  isLoading = true;
  isLoaded = false;
  hasError = false;

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    this.width = args.width;
    this.height = args.height || window.innerHeight / 1.65;
    this.src = args.src;
  }

  @action
  loadImage(element: HTMLImageElement): void {
    this.image = new Image(this.width, this.height);
    this.image.addEventListener('load', this.onLoad.bind(this));
    this.image.addEventListener('error', this.onError.bind(this));
    this.image.src = this.src;
    this.el = element;
  }

  onLoad(): void {
    this.isLoading = false;
    this.isLoaded = true;
    this.hasError = false;
    if (this.image) {
      this.el?.replaceWith(this.image);
    }
  }

  onError(): void {
    this.isLoading = false;
    this.isLoaded = false;
    this.hasError = true;
  }

  willDestroy(): void {
    super.willDestroy();
    this.image?.removeEventListener('load', this.onLoad.bind(this));
    this.image?.removeEventListener('error', this.onError.bind(this));
    this.image = undefined;
    this.el = undefined;
  }
}
