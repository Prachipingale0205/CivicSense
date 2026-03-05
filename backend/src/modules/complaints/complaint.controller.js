const complaintService = require("./complaint.service");

const createComplaint = async (req, res, next) => {
  try {
    const { title, description, location } = req.body;
    const result = await complaintService.createComplaint(
      { title, description, location },
      req.user.id
    );
    res.status(201).json({
      success: true,
      message: "Complaint submitted and analyzed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getComplaintByTrackingId = async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintByTrackingId(req.params.trackingId);
    res.status(200).json({
      success: true,
      data: { complaint },
    });
  } catch (error) {
    next(error);
  }
};

const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await complaintService.getComplaintsByCitizen(req.user.id);
    res.status(200).json({
      success: true,
      count: complaints.length,
      data: { complaints },
    });
  } catch (error) {
    next(error);
  }
};

const chatWithBot = async (req, res, next) => {
  try {
    const { message } = req.body;
    const result = await complaintService.chatWithBot(message, req.user.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createComplaint, getComplaintByTrackingId, getMyComplaints, chatWithBot };