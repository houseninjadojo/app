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

export enum OnboardingStep {
  AreaNotification = 'area-notification',
  BookingConfirmation = 'booking-confirmation',
  ContactInfo = 'contact-info',
  PaymentMethod = 'payment-method',
  PlanSelection = 'plan-selection',
  PropertyInfo = 'property-info',
  ServiceArea = 'service-area',
  SetPassword = 'set-password',
  WalkthroughBooking = 'walkthrough-booking',
  Welcome = 'welcome',
  Completed = 'completed',
  AccountSetup = 'account-setup', // this one is independent of the onboarding flow
}

// eslint-disable-next-line prettier/prettier
export function nextStep(currentStep?: OnboardingStep): OnboardingStep | undefined {
  switch (currentStep) {
    case OnboardingStep.AreaNotification:
      return undefined;
    case OnboardingStep.BookingConfirmation:
      return OnboardingStep.Completed;
    case OnboardingStep.ContactInfo:
      return OnboardingStep.PaymentMethod;
    case OnboardingStep.PaymentMethod:
      return OnboardingStep.Welcome;
    case OnboardingStep.PlanSelection:
      return OnboardingStep.PaymentMethod;
    case OnboardingStep.PropertyInfo:
      return OnboardingStep.WalkthroughBooking;
    case OnboardingStep.ServiceArea:
      return OnboardingStep.ContactInfo;
    case OnboardingStep.SetPassword:
      return OnboardingStep.BookingConfirmation;
    case OnboardingStep.WalkthroughBooking:
      return OnboardingStep.SetPassword;
    case OnboardingStep.Welcome:
      return OnboardingStep.SetPassword;
    case OnboardingStep.Completed:
      return undefined;
    default:
      return undefined;
  }
}
