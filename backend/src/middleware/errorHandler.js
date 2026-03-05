const env = require("../config/env");

// Global error handler — must have 4 params for Express to treat it as error middleware
const errorHandler = (err, req, res, next) => {
  // Use error's own status code or default to 500
  const statusCode = err.statusCode || 500;

  // Log the error internally — never hide errors in development
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",

    // Show stack trace only in development — never expose in production
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Helper to create consistent errors anywhere in the app
// Usage: throw createError(404, "Complaint not found")
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = { errorHandler, createError };