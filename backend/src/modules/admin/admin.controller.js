// ─── Admin Controller ──────────────────────────────────────────────
// Thin HTTP adapter layer — zero business logic here.
// Only responsibilities:
// 1. Extract data from req (body, params, query, user)
// 2. Call the correct admin service function
// 3. Return formatted JSON response
// 4. Pass errors to next() for global error handler

const adminService = require("./admin.service");

// ─── List All Complaints ───────────────────────────────────────────
// GET /api/admin/complaints
// Query: ?page=1&limit=20&status=Submitted&category=Water+Supply&urgency=Critical&department=...&sortBy=urgencyScore&order=desc
const listComplaints = async (req, res, next) => {
    try {
        const { page, limit, status, category, urgency, department, sortBy, order } = req.query;

        const result = await adminService.listComplaints({
            page,
            limit,
            status,
            category,
            urgency,
            department,
            sortBy,
            order,
        });

        res.status(200).json({
            success: true,
            ...result, // spreads { complaints, pagination }
        });
    } catch (error) {
        next(error);
    }
};

// ─── Get Single Complaint Detail ───────────────────────────────────
// GET /api/admin/complaints/:id
const getComplaintById = async (req, res, next) => {
    try {
        const complaint = await adminService.getComplaintById(req.params.id);

        res.status(200).json({
            success: true,
            data: { complaint },
        });
    } catch (error) {
        next(error);
    }
};

// ─── Update Complaint Status ───────────────────────────────────────
// PUT /api/admin/complaints/:id/status
// Body: { status: "In Progress", note: "Optional note for audit trail" }
const updateStatus = async (req, res, next) => {
    try {
        const { status, note } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "status field is required",
            });
        }

        const updated = await adminService.updateStatus(
            req.params.id,
            { status, note },
            req.user.id // Officer's ID captured from JWT for audit trail
        );

        res.status(200).json({
            success: true,
            message: `Complaint status updated to "${status}"`,
            data: { complaint: updated },
        });
    } catch (error) {
        next(error);
    }
};

// ─── Assign Officer ────────────────────────────────────────────────
// PUT /api/admin/complaints/:id/assign
// Body: { officerId: "mongo_ObjectId" }
const assignOfficer = async (req, res, next) => {
    try {
        const { officerId } = req.body;

        if (!officerId) {
            return res.status(400).json({
                success: false,
                message: "officerId field is required",
            });
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

// ─── List Officers ─────────────────────────────────────────────────
// GET /api/admin/officers
const listOfficers = async (req, res, next) => {
    try {
        const officers = await adminService.listOfficers();

        res.status(200).json({
            success: true,
            count: officers.length,
            data: { officers },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listComplaints,
    getComplaintById,
    updateStatus,
    assignOfficer,
    listOfficers,
};
