const mongoose = require("mongoose");
const Complaint = require("../complaints/complaint.model");
const User = require("../auth/user.model");
const { createError } = require("../../middleware/errorHandler");

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
  const filter = {};
  if (status)     filter.status = status;
  if (category)   filter.category = category;
  if (urgency)    filter.urgencyLabel = urgency;
  if (department) filter.department = department;

  const pageNum  = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip     = (pageNum - 1) * limitNum;

  const sortDir = order === "asc" ? 1 : -1;
  const sortObj = { [sortBy]: sortDir };
  if (sortBy === "urgencyScore") {
    sortObj.createdAt = -1;
  }

  const [total, complaints] = await Promise.all([
    Complaint.countDocuments(filter),
    Complaint.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .populate("citizen",         "name email")
      .populate("assignedOfficer", "name email")
      .select("-__v"),
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

const getComplaintById = async (id) => {
  const complaint = await Complaint.findOne({ trackingId: id })
    .populate("citizen",                "name email createdAt")
    .populate("assignedOfficer",        "name email")
    .populate("statusHistory.updatedBy","name role")
    .select("-__v");

  if (!complaint) {
    throw createError(404, `Complaint not found with tracking ID: ${id}`);
  }

  return complaint;
};

const updateStatus = async (id, { status, note }, officerId) => {
  const validStatuses = ["Submitted", "Under Review", "In Progress", "Resolved", "Rejected"];
  if (!validStatuses.includes(status)) {
    throw createError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const complaint = await Complaint.findOne({ trackingId: id });
  if (!complaint) {
    throw createError(404, `Complaint not found with tracking ID: ${id}`);
  }

  if (["Resolved", "Rejected"].includes(complaint.status) && complaint.status === status) {
    throw createError(409, `Complaint is already ${complaint.status}`);
  }

  const historyEntry = {
    status,
    note:      note || "",
    updatedBy: officerId,
    timestamp: new Date(),
  };

  const updateOps = {
    $push: { statusHistory: historyEntry },
    $set: {
      status,
      updatedAt: new Date(),
      ...(status === "Resolved" && { resolvedAt: new Date() }),
    },
  };

  const updated = await Complaint.findOneAndUpdate({ trackingId: id }, updateOps, {
    new:           true,
    runValidators: true,
  })
    .populate("citizen",                "name email")
    .populate("assignedOfficer",        "name email")
    .populate("statusHistory.updatedBy","name role");

  return updated;
};

const assignOfficer = async (id, officerId) => {
  if (!mongoose.Types.ObjectId.isValid(officerId)) {
    throw createError(400, "Invalid officer ID format");
  }

  const officer = await User.findById(officerId);
  if (!officer) {
    throw createError(404, "Officer not found");
  }
  if (officer.role !== "officer") {
    throw createError(400, `User ${officer.name} is a ${officer.role}, not an officer`);
  }

  const updated = await Complaint.findOneAndUpdate(
    { trackingId: id },
    { $set: { assignedOfficer: officerId } },
    { new: true }
  )
    .populate("citizen",         "name email")
    .populate("assignedOfficer", "name email");

  if (!updated) {
    throw createError(404, `Complaint not found with tracking ID: ${id}`);
  }

  return updated;
};

const listOfficers = async () => {
  const officers = await User.find({ role: "officer" })
    .select("name email createdAt")
    .sort({ name: 1 });

  return officers;
};

module.exports = {
  listComplaints,
  getComplaintById,
  updateStatus,
  assignOfficer,
  listOfficers,
};