import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PrimitiveImageComponent extends Component {
  el = null;
  image = null;
  width = null;
  height = null;
  src = null;

  isLoading = true;
  isLoaded = false;
  hasError = false;

  constructor(owner, args) {
    super(owner, args);

    this.width = args.width;
    this.height = args.height || window.innerHeight / 1.65;
    this.src = args.src;
  }

  @action
  loadImage(element) {
    this.image = new Image(this.width, this.height);
    this.image.addEventListener('load', this.onLoad.bind(this));
    this.image.addEventListener('error', this.onError.bind(this));
    this.image.src = this.src;
    this.el = element;
  }

  onLoad() {
    this.isLoading = false;
    this.isLoaded = true;
    this.hasError = false;
    this.el.replaceWith(this.image);
  }

  onError() {
    this.isLoading = false;
    this.isLoaded = false;
    this.hasError = true;
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.image.removeEventListener('load', this.onLoad.bind(this));
    this.image.removeEventListener('error', this.onError.bind(this));
    this.image = null;
    this.el = null;
  }
}
