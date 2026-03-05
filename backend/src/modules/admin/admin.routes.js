// ─── Admin Routes ──────────────────────────────────────────────────
// All routes in this module require:
// 1. Valid JWT token (protect middleware)
// 2. Role: admin OR officer (restrictTo middleware)
//
// Route order matters — specific paths before parameterized paths.
// /officers must come before /:id or Express matches "officers" as an ID param.

const express = require("express");
const {
    listComplaints,
    getComplaintById,
    updateStatus,
    assignOfficer,
    listOfficers,
} = require("./admin.controller");
const { protect, restrictTo } = require("../../middleware/auth.middleware");

const router = express.Router();

// Apply auth to ALL routes in this module
// Every admin route requires valid JWT + admin or officer role
router.use(protect);
router.use(restrictTo("admin", "officer"));

// ── Complaint Management ───────────────────────────────────────────

// GET  /api/admin/complaints
// List complaints — paginated, filterable, sorted by urgency
router.get("/complaints", listComplaints);

// GET  /api/admin/complaints/:id
// Full complaint detail with populated citizen + officer
router.get("/complaints/:id", getComplaintById);

// PUT  /api/admin/complaints/:id/status
// Update status + append to audit trail
// Body: { status, note? }
router.put("/complaints/:id/status", updateStatus);

// PUT  /api/admin/complaints/:id/assign
// Assign complaint to an officer — admin only
// Body: { officerId }
router.put(
    "/complaints/:id/assign",
    restrictTo("admin"), // Only admin can reassign — officers cannot self-assign
    assignOfficer
);

// ── Officer Management ─────────────────────────────────────────────

// GET  /api/admin/officers
// List all users with role=officer (used by assignment dropdown in admin UI)
// IMPORTANT: /officers must be defined before /:id — route order matters
router.get("/officers", listOfficers);

module.exports = router;
