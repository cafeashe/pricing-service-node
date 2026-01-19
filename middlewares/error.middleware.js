function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  console.error({
    requestId: req.requestId,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });

  res.status(status).json({
    error: "Error interno del servidor",
    message: err.message,
    requestId: req.requestId
  });
}

module.exports = errorHandler;
