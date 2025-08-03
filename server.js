import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import paymentRouter from "./routes/payment.route.js";
import cors from "cors";

dotenv.config();
const port = process.env.port ? Number(process.env.port) : 3000;

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//route to check the API health
app.get("/health", async (req, res) => {
  res.status(200).send("Payment service is healthy");
});

//middleware to route to Payments
app.use("/payments", paymentRouter);

// Only listen in development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
