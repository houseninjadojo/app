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

export enum DefaultRoute {
  SignedIn = 'dashboard.home',
  SignedOut = 'login-or-signup',
  Signup = 'signup.index',
}

export enum SignupRoute {
  Index = 'signup.index',
  AreaNotification = 'signup.area-notification',
  PlanSelection = 'signup.plan-selection',
  ContactInfo = 'signup.contact-info',
  PaymentMethod = 'signup.payment-method',
  SetPassword = 'signup.set-password',
  Welcome = 'signup.welcome',
  PropertyInfo = 'signup.property-info',
  WalkthroughBooking = 'signup.walkthrough-booking',
  BookingConfirmation = 'signup.booking-confirmation',
}

export enum DashboardRoute {
  Index = 'dashboard.index',
  Home = 'dashboard.home',
  History = 'dashboard.work-history',
  HandleIt = 'dashboard.handle-it',
}

export enum AuthRoute {
  LoginOrSignup = 'login-or-signup',
  Login = 'login',
  Signup = 'signup',
}

export enum OnboardingRoute {
  Index = 'onboarding.index',
  ContactInfo = 'onboarding.contact-info',
  SetPassword = 'onboarding.set-password',
  Welcome = 'onboarding.welcome',
  PropertyInfo = 'onboarding.property-info',
  WalkthroughBooking = 'onboarding.walkthrough-booking',
  BookingConfirmation = 'onboarding.booking-confirmation',
}

export enum SettingsRoute {
  Index = 'settings.index',
  Contact = 'settings.contact',
  Payment = 'settings.payment',
  Security = 'settings.security',
  Property = 'settings.property',
}

export enum SubscriptionRoute {
  Cancel = 'cancel-subscription.index',
  CancelConfirmation = 'cancel-subscription.confirmation',
}

export enum VaultRoute {
  Index = 'vault.index',
  ShowDocument = 'vault.documents.document',
  NewDocument = 'vault.documents.new',
  EditDocument = 'vault.documents.document.edit',
  ShowGroup = 'vault.groups.group',
  NewGroup = 'vault.groups.new',
  EditGroup = 'vault.groups.group.edit',
}

export enum WorkOrderRoute {
  Index = 'work-orders.index',
  Show = 'work-orders.work-order',
}

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
