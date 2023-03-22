import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
const CheckoutForm = () => {
  const selectedProducts = useSelector(
    (state) => state.selectedProducts.products
  );

  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log(
        'Order canceled -- continue to shop around and checkout when you’re ready.'
      );
    }
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    let lineItems = selectedProducts.map((p) => {
      return {
        price: p.stripe_price_id,
        quantity: 1,
      };
    });
    console.log('LINE ITEMS', lineItems);
    console.log(JSON.stringify({ lineItems: lineItems }));
    fetch('api/checkout-sessions', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify([...lineItems]),
    }).then((res) => console.log('RESPONSE', res));
  };

  return (
    <>
      <button onClick={submitForm}>Click to submit</button>
      <form
        action="/api/checkout-sessions"
        method="POST"
        onSubmit={(e) => {
          console.log('CLICKED');
        }}
      >
        <section>
          <button type="submit" role="link">
            Checkout
          </button>
        </section>
      </form>
    </>
  );
};

export default CheckoutForm;
