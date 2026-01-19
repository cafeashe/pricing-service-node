require("dotenv").config();
const express = require("express");
const app = express();

/* =====================
   IMPORTS
===================== */
const requestId = require("./middlewares/requestId.middleware.js");
const errorHandler = require("./middlewares/error.middleware.js");

const healthRoutes = require("./routes/health.routes.js");
const checkoutRoutes = require("./routes/checkout.routes.js");

/* =====================
   MIDDLEWARES
===================== */
app.use(express.json());
app.use(requestId);

/* =====================
   ROUTES
===================== */
app.use("/health", healthRoutes);
app.use("/checkout", checkoutRoutes);

app.get("/", (req, res) => {
  res.json({
    mensaje: "pricing-service funcionando",
    endpoints: [
      "/health",
      "/checkout/quote",
      "/checkout/confirm",
      "/checkout/orders"
    ],
    requestId: req.requestId
  });
});

/* =====================
   ERROR HANDLER (SIEMPRE AL FINAL)
===================== */
app.use(errorHandler);

/* =====================
   SERVER
===================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Pricing service activo en http://localhost:${PORT}`);
});
