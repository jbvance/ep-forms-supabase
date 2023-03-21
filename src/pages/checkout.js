import React, { useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from 'components/CheckoutForm';
import supabase from 'util/supabase';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutPage = (props) => {
  const [clientSecret, setClientSecret] = React.useState('');

  useEffect(() => {
    const createPaymentIntent = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session ? session.access_token : '';
      //Create PaymentIntent as soon as the page loads
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ items: [{ id: 'xl-tshirt' }] }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    };

    createPaymentIntent();
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default CheckoutPage;
