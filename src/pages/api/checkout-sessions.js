const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log(req.body);
      console.log('GOT HERE');
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: 'price_1MoR55Ee6HsjpSHTzNrEyx3W', quantity: 1 }],
        mode: 'payment',
        success_url: `${req.headers.origin}/files-dashboard?success=true`,
        cancel_url: `${req.headers.origin}/files-dashboard?canceled=true`,
      });
      res.redirect(303, session.url);
    } catch (err) {
      console.log('ERROR IN checkout-sessions', err.message);
      res
        .status(err.statusCode || 500)
        .json({ status: 'error', message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
