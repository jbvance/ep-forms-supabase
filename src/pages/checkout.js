import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FormAlert from 'components/FormAlert';
import { Elements, AddressElement } from '@stripe/react-stripe-js';
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
  const [checkoutError, setCheckoutError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const selectedProducts = useSelector(
    (state) => state.selectedProducts.products
  );
  console.log('SELECTED PRODUCTS', selectedProducts);
  let totalPriceInCents = 0;
  selectedProducts.forEach((p) => (totalPriceInCents += p.price));
  console.log('TOTAL PRICE', totalPriceInCents);

  useEffect(() => {
    const itemsToPurchase = selectedProducts.map((product) => ({
      price: product.stripe_price_id,
      quantity: 1,
    }));
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
        body: JSON.stringify({ items: [...selectedProducts] }),
        //body: JSON.stringify({ items: [{ id: 'xl-tshirt' }] }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('data:', data);
          setClientSecret(data.clientSecret);
        })
        .catch((err) => {
          setCheckoutError('An error occurred. Please try again later');
          console.log('ERROR', err);
        });
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
          <CheckoutForm totalPriceInCents={totalPriceInCents} />
        </Elements>
      )}
      {checkoutError && <FormAlert type="error" message={checkoutError} />}
    </div>
  );
};

export default CheckoutPage;
