export const SIGNUP_ROUTE = {
  INDEX: 'signup',
  AREA_NOTIFICATION: 'signup.area-notification',
  PLAN_SELECTION: 'signup.plan-selection',
  CONTACT_INFO: 'signup.contact-info',
  PAYMENT_METHOD: 'signup.payment-method',
  SET_PASSWORD: 'signup.set-password',
  WELCOME: 'signup.welcome',
  PROPERTY_INFO: 'signup.property-info',
  WALKTHROUGH_BOOKING: 'signup.walkthrough-booking',
  BOOKING_CONFIRMATION: 'signup.booking-confirmation',
};

export const NATIVE_MOBILE_ROUTE = {
  DASHBOARD: {
    INDEX: 'dashboard',
    HOME: 'dashboard.home',
    HISTORY: 'dashboard.work-history',
    HANDLE_IT: 'dashboard.handle-it',
  },
  auth: {
    loginOrSignup: 'login-or-signup',
    login: 'login',
    logout: 'logout',
  },
  SETTINGS: {
    INDEX: 'settings',
    CONTACT: 'settings.contact',
    PAYMENT: 'settings.payment',
    SECURITY: 'settings.security',
    PROPERTY: 'settings.property',
  },
  faq: 'faq',
  vault: {
    index: 'vault',
    document: {
      index: 'vault.document.index',
      add: 'vault.document.add',
      edit: 'vault.document.edit',
    },
    group: {
      index: 'vault.group.index',
      add: 'vault.group.add',
      edit: 'vault.group.edit',
    },
  },
  workOrder: 'work-order',
};
