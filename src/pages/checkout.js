import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import FormAlert from 'components/FormAlert';
import { Elements, AddressElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from 'util/auth';
import CheckoutForm from 'components/CheckoutForm';
import supabase from 'util/supabase';
import { addUserDocPaymentIntent } from 'util/db';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutPage = (props) => {
  const [checkoutError, setCheckoutError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const router = useRouter();
  const auth = useAuth();
  const selectedProducts = useSelector(
    (state) => state.selectedProducts.products
  );
  const docStatus = router.query.status;
  console.log('SELECTED PRODUCTS', selectedProducts);
  let totalPriceInCents = 0;
  selectedProducts.forEach((p) => (totalPriceInCents += p.price));
  //console.log('TOTAL PRICE', totalPriceInCents);

  const addUserDocs = async (paymentIntentId) => {
    const userDocsPromises = selectedProducts.map(async (p) => {
      console.log('PRODUCT ID', p.id);
      return await addUserDocPaymentIntent(auth.user.id, p.id, paymentIntentId);
    });
    return await Promise.all(userDocsPromises);
  };

  useEffect(() => {
    console.log('TOTAL PRICE IN CENTS', totalPriceInCents);
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
        body: JSON.stringify({
          items: [...selectedProducts],
          amount: totalPriceInCents,
        }),
        //body: JSON.stringify({ items: [{ id: 'xl-tshirt' }] }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('data:', data);
          setClientSecret(data.clientSecret);
          // Insert a row into user_documents with payment intent so we
          // can update to paid once payment is complete
          return addUserDocs(data.id);
        })
        .then(() => console.log('DONE'))
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
      {docStatus === 'success' && (
        <FormAlert
          type="success"
          message="Your document(s) were successfully created. Review your order below and pay to receive your comleted documents."
        />
      )}
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
