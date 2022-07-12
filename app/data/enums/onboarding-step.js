export const AREA_NOTIFICATION = 'area-notification';
export const BOOKING_CONFIRMATION = 'booking-confirmation';
export const CONTACT_INFO = 'contact-info';
export const PAYMENT_METHOD = 'payment-method';
export const PLAN_SELECTION = 'plan-selection';
export const PROPERTY_INFO = 'property-info';
export const SERVICE_AREA = 'service-area';
export const SET_PASSWORD = 'set-password';
export const WALKTHROUGH_BOOKING = 'walkthrough-booking';
export const WELCOME = 'welcome';
export const COMPLETED = 'completed';
export const ACCOUNT_SETUP = 'account-setup'; // this one is independent of the onboarding flow

export const ALL = [
  AREA_NOTIFICATION,
  BOOKING_CONFIRMATION,
  CONTACT_INFO,
  PAYMENT_METHOD,
  PLAN_SELECTION,
  PROPERTY_INFO,
  SERVICE_AREA,
  SET_PASSWORD,
  WALKTHROUGH_BOOKING,
  WELCOME,
  COMPLETED,
];

export function nextStep(currentStep) {
  switch (currentStep) {
    case AREA_NOTIFICATION:
      return null;
    case BOOKING_CONFIRMATION:
      return COMPLETED;
    case CONTACT_INFO:
      return PAYMENT_METHOD;
    case PAYMENT_METHOD:
      return WELCOME;
    case PLAN_SELECTION:
      return PAYMENT_METHOD;
    case PROPERTY_INFO:
      return WALKTHROUGH_BOOKING;
    case SERVICE_AREA:
      return CONTACT_INFO;
    case SET_PASSWORD:
      return BOOKING_CONFIRMATION;
    case WALKTHROUGH_BOOKING:
      return SET_PASSWORD;
    case WELCOME:
      return PROPERTY_INFO;
    case COMPLETED:
      return null;
    default:
      return null;
  }
}
