const express = require('express');
const router = express.Router();
// Read Stripe key at runtime and validate it before calling the API.
const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
let stripe;
if (stripeSecret && !stripeSecret.includes('...')) {
  stripe = require('stripe')(stripeSecret);
} else {
  console.warn('Stripe secret key is not configured or looks like a placeholder. Stripe routes will return a helpful error until a valid key is provided.');
}
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Create a Stripe Checkout Session for the cart
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    // Validate Stripe configuration before proceeding
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe secret key is not configured on the server. Set STRIPE_SECRET_KEY in the backend .env with a valid secret key.' });
    }
    const { items, orderMeta } = req.body; // items = [{title, price, qty, image, productId}]
    const line_items = items.map(it => ({
      price_data: {
        currency: 'inr',
        unit_amount: Math.round(it.price * 100),
        product_data: {
          name: it.title,
          images: it.image ? [it.image] : undefined,
          metadata: { productId: it.productId || '' }
        }
      },
      quantity: it.qty
    }));

    // Optional: create a pending order in DB to mark later in webhook
    const pendingOrder = await Order.create({
      user: req.user._id,
      orderItems: items.map(it => ({ product: it.productId, title: it.title, qty: it.qty, price: it.price, image: it.image })),
      itemsPrice: items.reduce((s, i) => s + i.price * i.qty, 0),
      shippingPrice: orderMeta?.shippingPrice || 0,
      taxPrice: orderMeta?.taxPrice || 0,
      totalPrice: items.reduce((s, i) => s + i.price * i.qty, 0) + (orderMeta?.shippingPrice||0) + (orderMeta?.taxPrice||0),
      paymentMethod: 'stripe'
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      customer_email: req.user.email,
      metadata: { orderId: pendingOrder._id.toString() },
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/cart`
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
