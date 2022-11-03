import { TemplateFactory } from 'ember-cli-htmlbars';
import * as BranchWeb from 'branch-sdk';

// Types for compiled templates
declare module 'houseninja/templates/*' {
  // import { TemplateFactory } from 'ember-cli-htmlbars';

  const tmpl: TemplateFactory;
  export default tmpl;
}

declare module 'branch-sdk' {
  interface Branch {
    init: typeof BranchWeb.init;
    first: typeof BranchWeb.first;
    setIdentity: typeof BranchWeb.setIdentity;
    logout: typeof BranchWeb.logout;
    getBrowserFingerprintId: typeof BranchWeb.getBrowserFingerprintId;
    crossPlatformIds: typeof BranchWeb.crossPlatformIds;
    lastAttributedTouchData: typeof BranchWeb.lastAttributedTouchData;
    logEvent: typeof BranchWeb.logEvent;
    link: typeof BranchWeb.link;
    sendSMS: typeof BranchWeb.sendSMS;
    deepview: typeof BranchWeb.deepview;
    deepviewCta: typeof BranchWeb.deepviewCta;
    credits: typeof BranchWeb.credits;
    creditHistory: typeof BranchWeb.creditHistory;
    redeem: typeof BranchWeb.redeem;
    addListener: typeof BranchWeb.addListener;
    removeListener: typeof BranchWeb.removeListener;
    setBranchViewData: typeof BranchWeb.setBranchViewData;
    closeJourney: typeof BranchWeb.closeJourney;
    autoAppIndex: typeof BranchWeb.autoAppIndex;
    trackCommerceEvent: typeof BranchWeb.trackCommerceEvent;
    disableTracking: typeof BranchWeb.disableTracking;
  }
}
