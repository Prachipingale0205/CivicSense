const express = require("express");
const { createComplaint, getComplaintByTrackingId, getMyComplaints, chatWithBot } = require("./complaint.controller");
const { protect } = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/", protect, createComplaint);
router.get("/user", protect, getMyComplaints);
router.get("/:trackingId", getComplaintByTrackingId);
router.post("/chat", protect, chatWithBot);

module.exports = router;