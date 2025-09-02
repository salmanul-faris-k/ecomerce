const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay with env vars
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET, // ✅ Use correct name
});

// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise
      currency: currency || 'INR',
      receipt: `order_rcptid_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: 'Order creation failed' });
  }
};

// Verify payment signature
exports.verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET) // ✅ Use same env var
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (sign === razorpay_signature) {
    res.json({ status: 'success' });
  } else {
    res.status(400).json({ error: 'Invalid signature' });
  }
};
