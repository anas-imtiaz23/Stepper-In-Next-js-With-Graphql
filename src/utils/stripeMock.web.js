// src/utils/stripeMock.web.js
// Complete mock for Stripe React Native on web

// Mock components
export const StripeProvider = ({ children }) => children;

export const useStripe = () => ({
  initPaymentSheet: async () => ({ error: null }),
  presentPaymentSheet: async () => ({ error: null }),
  confirmPayment: async () => ({ error: null }),
  confirmSetup: async () => ({ error: null }),
  createToken: async () => ({ error: null }),
  createPaymentMethod: async () => ({ error: null }),
  retrievePaymentIntent: async () => ({ error: null }),
});

export const useApplePay = () => ({
  isApplePaySupported: false,
  presentApplePay: async () => ({ error: null }),
  confirmApplePay: async () => ({ error: null }),
});

export const useGooglePay = () => ({
  isGooglePaySupported: false,
  presentGooglePay: async () => ({ error: null }),
  confirmGooglePay: async () => ({ error: null }),
});

// Mock components
export const CardField = () => null;
export const CardForm = () => null;
export const AuBECSDebitForm = () => null;
export const ApplePayButton = () => null;
export const GooglePayButton = () => null;
export const PaymentSheet = () => null;

// Mock all exports
export default {
  StripeProvider,
  useStripe,
  useApplePay,
  useGooglePay,
  CardField,
  CardForm,
  AuBECSDebitForm,
  ApplePayButton,
  GooglePayButton,
  PaymentSheet,
};