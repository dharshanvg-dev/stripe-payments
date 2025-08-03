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
    res.redirect(303, session.url);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Stripe error");
  }
};
