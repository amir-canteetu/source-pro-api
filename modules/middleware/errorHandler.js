const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    code: statusCode,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });

  if (res.headersSent) {
    next(err);
  }
};

module.exports = errorHandler;
