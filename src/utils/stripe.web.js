// src/utils/stripe.web.js
// Web version - Stripe for web using @stripe/stripe-js
import { loadStripe } from '@stripe/stripe-js';

// Your publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51T4n4pF3mbxtWI52jJbN3r8EmkcuQF9HH5Lk2uxO4bL3yy019wyz9B62TOmWtLu5Iijs7hF9c69XsgrBsJ8tKvBv0065o3lsXB';

// Load Stripe for web
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Mock the native Stripe hooks for web
export const useStripe = () => {
  return {
    initPaymentSheet: async () => ({ error: null }),
    presentPaymentSheet: async () => ({ error: null }),
  };
};