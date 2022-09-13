export const SIGNUP_ROUTE = {
  INDEX: 'signup.index',
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
  AUTH: {
    LOGIN_OR_SIGNUP: 'login-or-signup',
    LOGIN: 'login',
    LOGOUT: 'logout',
  },
  ONBOARDING: {
    INDEX: 'onboarding',
    CONTACT_INFO: 'onboarding.contact-info',
    SET_PASSWORD: 'onboarding.set-password',
    WELCOME: 'onboarding.welcome',
    PROPERTY_INFO: 'onboarding.property-info',
    WALKTHROUGH_BOOKING: 'onboarding.walkthrough-booking',
    BOOKING_CONFIRMATION: 'onboarding.booking-confirmation',
  },
  SETTINGS: {
    INDEX: 'settings',
    CONTACT: 'settings.contact',
    PAYMENT_METHODS: {
      INDEX: 'settings.payment-methods',
      NEW: 'settings.payment-methods.new',
      PAYMENT_METHOD: {
        SHOW: 'settings.payment-methods.payment-method',
        EDIT: 'settings.payment-methods.payment-method.edit',
      },
    },
    SECURITY: 'settings.security',
    PROPERTY: 'settings.property',
  },
  CANCEL_SUBSCRIPTION: {
    INDEX: 'cancel-subscription.index',
    CONFIRMATION: 'cancel-subscription.confirmation',
  },
  FAQ: 'faq',
  VAULT: {
    INDEX: 'vault',
    DOCUMENTS: {
      SHOW: 'vault.documents.document',
      NEW: 'vault.documents.new',
      EDIT: 'vault.documents.document.edit',
    },
    GROUPS: {
      SHOW: 'vault.groups.group',
      NEW: 'vault.groups.new',
      EDIT: 'vault.groups.group.edit',
    },
  },
  WORK_ORDERS: {
    INDEX: 'work-orders',
    SHOW: 'work-orders.work-order',
  },
};
