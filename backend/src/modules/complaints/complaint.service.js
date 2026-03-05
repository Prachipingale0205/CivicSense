const Complaint = require("./complaint.model");
const groqService = require("../../services/groq.service");
const { createError } = require("../../middleware/errorHandler");

const createComplaint = async ({ title, description, location }, citizenId) => {
  if (!title || !description || !location) {
    throw createError(400, "Title, description, and location are required");
  }

  const aiResult = await groqService.analyzeComplaint(title, description);

  const complaint = await Complaint.create({
    title,
    description,
    location,
    citizen: citizenId,
    ...aiResult,
    statusHistory: [
      {
        status: "Submitted",
        note: "Complaint received and analyzed by CivicSense AI",
        updatedBy: null,
        timestamp: new Date(),
      },
    ],
  });

  return {
    trackingId:   complaint.trackingId,
    category:     complaint.category,
    department:   complaint.department,
    urgencyScore: complaint.urgencyScore,
    urgencyLabel: complaint.urgencyLabel,
    sentiment:    complaint.sentiment,
    aiSummary:    complaint.aiSummary,
    status:       complaint.status,
    createdAt:    complaint.createdAt,
  };
};

const getComplaintByTrackingId = async (trackingId) => {
  const complaint = await Complaint.findOne({ trackingId })
    .populate("citizen", "name")
    .populate("assignedOfficer", "name");

  if (!complaint) {
    throw createError(404, `No complaint found with tracking ID: ${trackingId}`);
  }

  return complaint;
};

const getComplaintsByCitizen = async (citizenId) => {
  const complaints = await Complaint.find({ citizen: citizenId })
    .sort({ createdAt: -1 })
    .select("trackingId title category urgencyScore urgencyLabel status createdAt department");

  return complaints;
};

const chatWithBot = async (message, citizenId) => {
  if (!message || typeof message !== "string" || message.trim() === "") {
    throw createError(400, "Message is required");
  }

  const latestComplaint = await Complaint.findOne({ citizen: citizenId })
    .sort({ createdAt: -1 })
    .select("trackingId title category status urgencyLabel department createdAt");

  const complaintContext = latestComplaint
    ? {
        trackingId:   latestComplaint.trackingId,
        title:        latestComplaint.title,
        category:     latestComplaint.category,
        status:       latestComplaint.status,
        urgencyLabel: latestComplaint.urgencyLabel,
        department:   latestComplaint.department,
        createdAt:    latestComplaint.createdAt,
      }
    : null;

  const reply = await groqService.chatbot(message, complaintContext);

  return { reply, complaintContext };
};

module.exports = {
  createComplaint,
  getComplaintByTrackingId,
  getComplaintsByCitizen,
  chatWithBot,
};