const adminService = require("./admin.service");

const listComplaints = async (req, res, next) => {
  try {
    const { page, limit, status, category, urgency, department, sortBy, order } = req.query;
    const result = await adminService.listComplaints({
      page, limit, status, category, urgency, department, sortBy, order,
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await adminService.getComplaintById(req.params.id);
    res.status(200).json({ success: true, data: { complaint } });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "status field is required" });
    }
    const updated = await adminService.updateStatus(req.params.id, { status, note }, req.user.id);
    res.status(200).json({
      success: true,
      message: `Complaint status updated to "${status}"`,
      data: { complaint: updated },
    });
  } catch (error) {
    next(error);
  }
};

const assignOfficer = async (req, res, next) => {
  try {
    const { officerId } = req.body;
    if (!officerId) {
      return res.status(400).json({ success: false, message: "officerId field is required" });
    }
    const updated = await adminService.assignOfficer(req.params.id, officerId);
    res.status(200).json({
      success: true,
      message: "Officer assigned successfully",
      data: { complaint: updated },
    });
  } catch (error) {
    next(error);
  }
};

const listOfficers = async (req, res, next) => {
  try {
    const officers = await adminService.listOfficers();
    res.status(200).json({ success: true, count: officers.length, data: { officers } });
  } catch (error) {
    next(error);
  }
};

module.exports = { listComplaints, getComplaintById, updateStatus, assignOfficer, listOfficers };