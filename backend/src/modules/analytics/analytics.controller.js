// ─── Analytics Controller ──────────────────────────────────────────
// Thin HTTP adapter — zero business logic.
// Calls the analytics service and returns the unified dashboard payload.

const analyticsService = require("./analytics.service");

// GET /api/admin/analytics
const getDashboardAnalytics = async (req, res, next) => {
    try {
        const data = await analyticsService.getDashboardAnalytics();

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getDashboardAnalytics };
