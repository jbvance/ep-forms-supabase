import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Row, Alert } from 'react-bootstrap';
import { useAuth } from 'util/auth';
import { updateUserDocsPaidStatus } from 'util/db';

const PaymentStatusPage = () => {
  const auth = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!auth.user) return;
    const query = new URLSearchParams(window.location.search);
    if (query.get('redirect_status') === 'canceled') {
      setErrorMessage('Your order was canceled');
      console.log(
        'Order canceled -- continue to shop around and checkout when you’re ready.'
      );
    }

    const paymentIntentId = query.get('payment_intent');
    if (!paymentIntentId) {
      setErrorMessage('Error - No payment intent was present');
    }

    const markDocsAsPaid = async () => {
      if (
        !query.get('payment_intent') ||
        !query.get('redirect_status') === 'succeeded'
      ) {
        setErrorMessage(
          'An error occurred. Please contact customer suport for assistance.'
        );
        return;
      }

      // Mark user_docs for payment_intent as paid
      try {
        const response = await updateUserDocsPaidStatus(paymentIntentId, true);
        console.log('RESPONSE', response);
        setSuccessMessage('Your Payment was processed successfully.');
      } catch (err) {
        console.error(err);
        setErrorMessage(
          'Your payment was processed successfully, but there was an error retrieving your documents. Please contact customer support for assistance.'
        );
      }
    };
    // Check to see if this is a redirect back from Checkout

    // if (query.get('redirect_status') === 'succeeded') {
    //   setSuccessMessage('Your payment was processed Succesfully');
    //   console.log('Order placed! You will receive an email confirmation.');
    // }

    markDocsAsPaid();
  }, [auth]);
  return (
    <Container>
      {successMessage && (
        <Alert variant="success">
          {successMessage}
          <br />{' '}
          <Link href="/dashboard-files">
            Click here to view and download your documents.
          </Link>
        </Alert>
      )}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    </Container>
  );
};

export default PaymentStatusPage;
