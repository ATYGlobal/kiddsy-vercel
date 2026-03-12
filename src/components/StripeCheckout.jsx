// src/components/StripeCheckout.jsx
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_tu_key');

export default function StripeCheckout({ priceId, mode }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm priceId={priceId} mode={mode} />
    </Elements>
  );
}