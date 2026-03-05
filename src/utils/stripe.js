// src/utils/stripe.js
import { Platform } from 'react-native';

let useStripe;

if (Platform.OS === 'web') {
  // Web platform - use mock
  const { useStripe: useStripeWeb } = require('./stripeMock.web');
  useStripe = useStripeWeb;
} else {
  // Native platforms (iOS, Android)
  const { useStripe: useStripeNative } = require('@stripe/stripe-react-native');
  useStripe = useStripeNative;
}

export { useStripe };