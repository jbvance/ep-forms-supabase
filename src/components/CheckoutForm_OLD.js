import React from 'react';
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Container, Row, Col } from 'react-bootstrap';

import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      console.log('PAYMENT INTENT', paymentIntent);
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: process.env.NEXT_PUBLIC_STRIPE_RETURN_URL,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs',
    defaultValues: {
      billingDetails: {
        name: 'Jason',
      },
    },
  };

  return (
    <Container style={{ border: '1px solid gray' }}>
      <Row>
        <Col className="StripeFormHeader">
          Enter your Payment Information below
        </Col>
      </Row>
      <Row>
        <Col>
          <form id="payment-form" onSubmit={handleSubmit}>
            {/* <LinkAuthenticationElement
          id="link-authentication-element"
          onChange={(e) => setEmail(e.target.value)}
  />*/}
            <PaymentElement
              id="payment-element"
              options={paymentElementOptions}
            />
            <Button
              type="submit"
              className="StripeSubmitButton"
              disabled={isLoading || !stripe || !elements}
              id="submit"
            >
              <span id="button-text">
                {isLoading ? <Spinner /> : 'Pay now'}
              </span>
            </Button>
            {/* Show any error or success messages */}
            {message && (
              <div className="CheckoutErrorMessage" id="payment-message">
                {message}
              </div>
            )}
          </form>
        </Col>
      </Row>
    </Container>
  );
}