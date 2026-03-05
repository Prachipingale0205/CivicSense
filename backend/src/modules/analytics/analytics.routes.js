// ─── Analytics Routes ──────────────────────────────────────────────
// Analytics data is read-only — all routes are GET only.
// Protected: requires valid JWT + admin or officer role.
// Mounted at: /api/admin/analytics (via app.js)

const express = require("express");
const { getDashboardAnalytics } = require("./analytics.controller");
const { protect, restrictTo } = require("../../middleware/auth.middleware");

const router = express.Router();

// GET /api/admin/analytics
// Returns unified dashboard payload: KPIs + charts + recent complaints
router.get("/", protect, restrictTo("admin", "officer"), getDashboardAnalytics);

module.exports = router;
