// 404 handler — must be registered after all routes
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Centralized error handler — must have 4 args
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal server error'
  });
};

module.exports = { notFound, errorHandler };
