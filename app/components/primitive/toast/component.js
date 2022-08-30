import Component from '@glimmer/component';
import { service } from '@ember/service';
import { TOAST_TYPE } from 'houseninja/data/enums/toast-type';

export default class ToastComponent extends Component {
  @service toast;
  
  get  message () {
    return this.toast.message;
  }

  get toastType (){
    return this.toast.type
  };

  get isVisible(){
    return this.toast.isVisible
  }

  get isAlert () {
    return this.toastType === TOAST_TYPE.ERROR || this.toastType === TOAST_TYPE.WARN
  }

  get isInfo () {
    return this.toastType === TOAST_TYPE.DEFAULT || this.toastType === TOAST_TYPE.INFO
  }
  
}