const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { createError } = require("./errorHandler");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Access denied. No token provided.");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(createError(401, "Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Token has expired. Please login again."));
    }
    next(error);
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(createError(403, "You do not have permission to perform this action"));
    }
    next();
  };
};

module.exports = { protect, restrictTo };