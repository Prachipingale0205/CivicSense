const mongoose = require("mongoose");
const generateTrackingId = require("../../utils/generateTrackingId");

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: "" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true, minlength: [10, "Min 10 chars"], maxlength: [150, "Max 150 chars"] },
    description: { type: String, required: [true, "Description is required"], trim: true, minlength: [20, "Min 20 chars"], maxlength: [2000, "Max 2000 chars"] },
    location: { type: String, required: [true, "Location is required"], trim: true },
    category: { type: String, enum: ["Water Supply","Roads & Infrastructure","Electricity","Sanitation & Waste","Public Safety","Healthcare","Education","Transportation","Environment","Other"], default: "Other" },
    department: { type: String, default: "General Administration" },
    urgencyScore: { type: Number, min: 1, max: 10, default: 5 },
    urgencyLabel: { type: String, enum: ["Low","Medium","High","Critical"], default: "Medium" },
    sentiment: { type: String, enum: ["Neutral","Frustrated","Angry","Urgent"], default: "Neutral" },
    aiSummary: { type: String, default: "" },
    status: { type: String, enum: ["Submitted","Under Review","In Progress","Resolved","Rejected"], default: "Submitted" },
    statusHistory: [statusHistorySchema],
    trackingId: { type: String, unique: true },
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ department: 1 });
complaintSchema.index({ urgencyScore: -1 });

complaintSchema.index({ urgencyScore: -1, createdAt: -1 });
complaintSchema.index({ citizen: 1, createdAt: -1 });
complaintSchema.index({ status: 1, category: 1 });

complaintSchema.pre("save", function() {
  if (this.isNew && !this.trackingId) {
    this.trackingId = generateTrackingId();
  }
});

module.exports = mongoose.model("Complaint", complaintSchema);
