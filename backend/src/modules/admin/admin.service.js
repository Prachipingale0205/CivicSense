// ─── Admin Service ─────────────────────────────────────────────────
// All business logic for the admin domain.
// Officers and admins manage complaints through these functions.
//
// Design decisions:
// 1. listComplaints supports compound filtering + pagination from day 1
//    (admin dashboard changes filters constantly — pagination prevents OOM)
// 2. updateStatus uses $push on statusHistory — never overwrites old entries
//    Append-only immutable audit trail is a production pattern (banking, healthcare)
// 3. resolvedAt is set automatically — never trust clients to send timestamps
// 4. All sorting defaults to urgencyScore DESC — most critical complaints first

const mongoose = require("mongoose");
const Complaint = require("../complaints/complaint.model");
const User = require("../auth/user.model");
const { createError } = require("../../middleware/errorHandler");

// ─── List Complaints ───────────────────────────────────────────────
// Compound MongoDB query with optional filters + pagination
// Sorted by urgencyScore DESC by default (most critical first)
// Called by: GET /api/admin/complaints

const listComplaints = async ({
  page = 1,
  limit = 20,
  status,
  category,
  urgency,
  department,
  sortBy = "urgencyScore",
  order = "desc",
} = {}) => {
  // Build filter object — only include fields the client actually sent
  const filter = {};
  if (status)     filter.status = status;
  if (category)   filter.category = category;
  if (urgency)    filter.urgencyLabel = urgency;
  if (department) filter.department = department;

  // Convert page/limit to numbers — query params come in as strings
  const pageNum  = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10))); // cap at 100

  const skip = (pageNum - 1) * limitNum;

  // Sort direction: -1 = DESC, 1 = ASC
  const sortDir = order === "asc" ? 1 : -1;
  const sortObj = { [sortBy]: sortDir };

  // If sorting by urgencyScore, add secondary sort by createdAt for stable ordering
  if (sortBy === "urgencyScore") {
    sortObj.createdAt = -1;
  }

  // Run count + data queries in parallel — faster than sequential
  const [total, complaints] = await Promise.all([
    Complaint.countDocuments(filter),
    Complaint.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .populate("citizen", "name email")          // Expose citizen name + email to admin
      .populate("assignedOfficer", "name email")  // Expose officer details
      .select("-__v"),                             // Strip internal Mongoose field
  ]);

  return {
    complaints,
    pagination: {
      total,
      page:       pageNum,
      limit:      limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNext:    pageNum < Math.ceil(total / limitNum),
      hasPrev:    pageNum > 1,
    },
  };
};

// ─── Get Complaint By ID ───────────────────────────────────────────
// Full complaint detail — used by admin's complaint detail view
// Populates citizen + officer for full context
// Called by: GET /api/admin/complaints/:id

const getComplaintById = async (id) => {
  // Validate MongoDB ObjectId before querying — prevents CastError on bad IDs
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, "Invalid complaint ID format");
  }

  const complaint = await Complaint.findById(id)
    .populate("citizen", "name email createdAt")
    .populate("assignedOfficer", "name email")
    .populate("statusHistory.updatedBy", "name role")
    .select("-__v");

  if (!complaint) {
    throw createError(404, `Complaint not found with ID: ${id}`);
  }

  return complaint;
};

// ─── Update Status ─────────────────────────────────────────────────
// Appends a new entry to statusHistory — never mutates existing entries
// Sets resolvedAt timestamp automatically when status = "Resolved"
// Called by: PUT /api/admin/complaints/:id/status

const updateStatus = async (id, { status, note }, officerId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, "Invalid complaint ID format");
  }

  const validStatuses = ["Submitted", "Under Review", "In Progress", "Resolved", "Rejected"];
  if (!validStatuses.includes(status)) {
    throw createError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    throw createError(404, `Complaint not found with ID: ${id}`);
  }

  // Prevent updating an already resolved/rejected complaint without admin override
  if (["Resolved", "Rejected"].includes(complaint.status) && complaint.status === status) {
    throw createError(409, `Complaint is already ${complaint.status}`);
  }

  // Build the new history entry
  const historyEntry = {
    status,
    note:      note || "",
    updatedBy: officerId,
    timestamp: new Date(),
  };

  // Use MongoDB operators for atomic update
  // $push = append to array (never replaces existing entries)
  // $set = update top-level fields
  const updateOps = {
    $push:  { statusHistory: historyEntry },
    $set: {
      status,
      updatedAt: new Date(),
      ...(status === "Resolved" && { resolvedAt: new Date() }), // Auto-set only on Resolved
    },
  };

  const updated = await Complaint.findByIdAndUpdate(id, updateOps, {
    new: true,           // Return the updated document
    runValidators: true, // Run schema validators on the update
  })
    .populate("citizen", "name email")
    .populate("assignedOfficer", "name email")
    .populate("statusHistory.updatedBy", "name role");

  return updated;
};

// ─── Assign Officer ────────────────────────────────────────────────
// Sets the assignedOfficer field on a complaint
// Admin-only action — officers cannot reassign to themselves
// Called by: PUT /api/admin/complaints/:id/assign

const assignOfficer = async (id, officerId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, "Invalid complaint ID format");
  }
  if (!mongoose.Types.ObjectId.isValid(officerId)) {
    throw createError(400, "Invalid officer ID format");
  }

  // Verify the target user is actually an officer (not a citizen or admin)
  const officer = await User.findById(officerId);
  if (!officer) {
    throw createError(404, "Officer not found");
  }
  if (officer.role !== "officer") {
    throw createError(400, `User ${officer.name} is a ${officer.role}, not an officer`);
  }

  const updated = await Complaint.findByIdAndUpdate(
    id,
    { $set: { assignedOfficer: officerId } },
    { new: true }
  )
    .populate("citizen", "name email")
    .populate("assignedOfficer", "name email");

  if (!updated) {
    throw createError(404, `Complaint not found with ID: ${id}`);
  }

  return updated;
};

// ─── List Officers ─────────────────────────────────────────────────
// Returns all users with role=officer
// Used to populate assignment dropdown in admin UI
// Called by: GET /api/admin/officers

const listOfficers = async () => {
  const officers = await User.find({ role: "officer" })
    .select("name email createdAt")
    .sort({ name: 1 }); // Alphabetical for dropdown readability

  return officers;
};

module.exports = {
  listComplaints,
  getComplaintById,
  updateStatus,
  assignOfficer,
  listOfficers,
};
