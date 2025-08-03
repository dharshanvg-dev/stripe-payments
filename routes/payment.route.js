import express from "express";
import { stripeCheckoutSession } from "../controller/payments.controller.js";

const router = express.Router();

router.post("/create-checkout-session", stripeCheckoutSession);

export default router;
