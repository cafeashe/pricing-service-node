const express = require("express");
const router = express.Router();

const { quoteCheckout, confirmCheckout, getOrders } = require("../controllers/checkout.controllers.js");

// POST /checkout/quote
router.post("/quote", quoteCheckout);

// POST /checkout/confirm
router.post("/confirm", confirmCheckout);

// GET /checkout/orders (solo demo)
router.get("/orders", getOrders);

module.exports = router;
