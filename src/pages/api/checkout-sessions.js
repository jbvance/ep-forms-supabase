const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: 'price_1Mo4d1Ee6HsjpSHTglHOcHkr',
            quantity: 1,
          },
          { price: 'price_1MoCoiEe6HsjpSHTn1eypz4h', quantity: 1 },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/files-dashboard?success=true`,
        cancel_url: `${req.headers.origin}/files-dashboard?canceled=true`,
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
