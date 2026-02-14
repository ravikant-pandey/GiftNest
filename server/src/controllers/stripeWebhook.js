import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";


// verify stripe payment is done or not
export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Payment completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const orderId = session.metadata.orderId;
    const userId = session.metadata.userId;

    // mark order paid
    await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
    });

    // clear cart
    await User.findByIdAndUpdate(userId, {
      cart: {},
    });
  }

  res.json({ received: true });
};