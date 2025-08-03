import express from "express";
import {
  stripeCheckoutSession,
  handleStripeWebhook,
} from "../controller/payments.controller.js";

const router = express.Router();

router.post("/create-checkout-session", stripeCheckoutSession);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
