import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class WalkthroughBookingComponent extends Component {
  @service router;

  constructor(owner, args) {
    super(owner, args);
    window.addEventListener('message', this.receiveWindowMessage.bind(this));
  }

  willDestroy() {
    super.willDestroy(...arguments);
    window.removeEventListener('message', this.receiveWindowMessage.bind(this));
  }

  @action
  injectScript() {
    this._injectScript();
  }

  @action
  async saveWalkthroughBooking() {
    this.router.transitionTo('signup.booking-confirmation');
  }

  @action
  goBack() {
    this.router.transitionTo('signup.welcome');
  }

  receiveWindowMessage(event) {
    if (this._isHubspotUrl(event.origin)) {
      if (event.data.meetingBookSucceeded || event.data.meetingCreated) {
        console.log(event);
        this.onMeetingBooked();
      }
    }
  }

  onMeetingBooked() {
    this.router.transitionTo('signup.booking-confirmation');
  }

  /* eslint-disable */
  _injectScript() {
    !function(){
      function t(t){return t.querySelectorAll("iframe").length>0}
      function n(){return"&parentPageUrl="+window.location.origin+window.location.pathname}
      function e(t){var n=null;if(document.cookie&&""!==document.cookie)for(var e=document.cookie.split(";"),o=0;o<e.length;o++){var r=e[o].trim(),i=t+"=";if(r.substring(0,t.length+1)===i){n=r.substring(t.length+1);break}}return n}
      function o(t){return t?"&parentHubspotUtk="+t:""}
      function r(){var t=window.location.search;return t?"&"+t.substr(1):""}
      function i(){var t=(new Date).getTime();return"xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,(function(n){var e=(t+16*Math.random())%16|0;t=Math.floor(t/16);return("x"===n?e:3&e|8).toString(16)}))}
      function a(){var t=window.crypto||window.msCrypto,n=new Uint16Array(8);t.getRandomValues(n);var e=function(t){for(var n=t.toString(16);n.length<4;)n="0"+n;return n};return e(n[0])+e(n[1])+e(n[2])+e(n[3])+e(n[4])+e(n[5])+e(n[6])+e(n[7])}
      function s(){var t=window.crypto||window.msCrypto;return void 0!==t&&void 0!==t.getRandomValues&&void 0!==window.Uint16Array?a():i()}
      function u(){var t=window.__hsUserToken||e("hubspotutk");if(!t){var n=s();t=n;window.__hsUserToken=n}return t}
      function c(t){return["https://local.hubspot.com","https://local.hubspotqa.com","https://app.hubspotqa.com","https://app.hubspot.com","https://meetings.hubspot.com","https://meetings.hubspotqa.com"].indexOf(t)>-1}var h,x=document.querySelectorAll(".meetings-iframe-container");for(h=0;h<x.length;h++){var l=x[h],d=l.dataset.src,p=l.dataset.title,g=document.createElement("iframe"),m=u();l.height="100%";g.src=d+o(m)+n()+r();p&&(g.title=p);g.width="100%";g.style.minWidth="312px";g.style.minHeight="516px";g.style.height="756px";g.style.border="none";if(!t(l)){l.appendChild(g);window.addEventListener("message",f)}
      function f(t){var n=t[t.message?"message":"data"];(c(t.origin)||t.origin.indexOf(window.origin)>-1)&&n.height&&(g.style.height=n.height+"px")}
    }}();
  }
  /* eslint-enable */

  _isHubspotUrl(url) {
    let hubspotUrls = [
      'https://local.hubspot.com',
      'https://app.hubspotqa.com',
      'https://app.hubspot.com',
      'https://meetings.hubspot.com',
    ];
    return hubspotUrls.indexOf(url) > -1;
  }
}
