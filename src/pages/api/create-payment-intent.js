const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import requireAuth from './_require-auth';

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  //return 995;
};

const handler = async (req, res) => {
  const { items, amount } = req.body;
  console.log('BODY', req.body);
  //console.log('ITEMS', items);
  //console.log('USER', req.user);
  const { user } = req;
  const metadataItems = items.map((item) => {
    return {
      id: item.id,
      type: item.type,
      price: item.price,
      fileName: item.file_name,
    };
  });
  let itemsMetadataString = '';
  items.map((item) => (itemsMetadataString += item.type + ', '));

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    //amount: calculateOrderAmount(items),
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      user_id: user.id,
      user_email: user.email,
      items: itemsMetadataString,
    },
  });

  //console.log('PAYMENT INTENT', paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

export default requireAuth(handler);
