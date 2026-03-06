const express = require("express");
const { createComplaint, getComplaintByTrackingId, getMyComplaints, chatWithBot } = require("./complaint.controller");
const { protect } = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/", protect, createComplaint);
router.get("/user", protect, getMyComplaints);
router.post("/chat", protect, chatWithBot);        // MUST be before /:trackingId
router.get("/:trackingId", getComplaintByTrackingId);

module.exports = router;