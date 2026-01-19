const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "pricing-service",
    timestamp: new Date().toISOString(),
    requestId: req.requestId
  });
});

module.exports = router;
