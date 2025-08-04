import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.urlencoded({ extended: true }));

export const stripeCheckoutSession = async (req, res) => {
  console.log("/create-checkout-session route trigger");
  const { amount } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Film Launcher" },
            unit_amount: parseInt(amount) * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.DOMAIN}/success.html`,
      cancel_url: `${process.env.DOMAIN}/cancel.html`,
    });
    console.log("####Create checkout response", session);
    res.redirect(303, session.url);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Stripe error");
  }
};

export const handleStripeWebhook = (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      console.log("Pledge completed:", event.data.object.id);
      break;
    case "checkout.session.expired":
      console.log("Pledge session expired:", event.data.object.id);
      break;
    case "payment_intent.payment_failed":
      console.log("Payment failed:", event.data.object.id);
      break;
    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  res.status(200).send("Stripe webhook received");
};
