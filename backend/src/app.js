const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// ─── Core Middleware ───────────────────────────────────────────────

// HTTP request logger — "dev" format: METHOD /path STATUS ms - bytes
// Skipped in test mode to keep test output clean
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data (multipart forms etc.)
app.use(express.urlencoded({ extended: true }));

// Enable CORS — allows the React frontend to call this API
// credentials: true is required for httpOnly cookie support
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ─── Rate Limiters ─────────────────────────────────────────────────
// Segmented by route class:
//   readLimiter  — GET-heavy endpoints: generous 100/15min
//   writeLimiter — POST/PUT submission endpoints: strict 20/15min
//   aiLimiter    — Groq chatbot endpoint: moderate 30/15min

const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,  // Emit RateLimit-* headers for clients to parse
  legacyHeaders: false,
  message: { success: false, message: "Too many requests — please slow down and try again." },
});

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many submissions — please wait before submitting again." },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Generous for hackathon demo
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Chatbot rate limit reached — please wait a moment and try again." },
});

// ─── Health Check Route ────────────────────────────────────────────
// Reports server + MongoDB connection state.
// Used by Render health checks, UptimeRobot pings, and pre-demo warm-up.
// readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting

app.get("/api/health", (req, res) => {
  const dbStateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  const dbState = mongoose.connection.readyState;

  res.status(200).json({
    status: "CivicSense API running",
    environment: process.env.NODE_ENV,
    db: dbStateMap[dbState] || "unknown",
    timestamp: new Date().toISOString(),
  });
});

// ─── Module Routes ─────────────────────────────────────────────────
// Each domain module is isolated — plugged in here.
// Rate limiters applied at route-group level for clean separation.

// Auth — login/register are write operations
app.use("/api/auth", writeLimiter, require("./modules/auth/auth.routes"));

// Complaints — all complaint routes (chat rate limit applied inside the router)
app.use("/api/complaints", require("./modules/complaints/complaint.routes"));

// Analytics — mounted BEFORE /api/admin so its specific path takes priority
app.use("/api/admin/analytics", readLimiter, require("./modules/analytics/analytics.routes"));

// Admin — complaint management, status updates, officer assignment
app.use("/api/admin", require("./modules/admin/admin.routes"));

// ─── 404 Handler ───────────────────────────────────────────────────
// Catches any request that didn't match a registered route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// ─── Global Error Handler ──────────────────────────────────────────
// Must be last — 4-argument signature required for Express error middleware
app.use(errorHandler);

module.exports = app;