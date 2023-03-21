const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import requireAuth from './_require-auth';

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 995;
};

const handler = async (req, res) => {
  const { items } = req.body;
  console.log('ITEMS', items);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  //console.log('PAYMENT INTENT', paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

export default requireAuth(handler);
