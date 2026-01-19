function healthCheck(req, res) {
  return res.status(200).json({
    status: "ok",
    service: "pricing-service",
    timestamp: new Date().toISOString(),
  });
}

module.exports = { healthCheck };
