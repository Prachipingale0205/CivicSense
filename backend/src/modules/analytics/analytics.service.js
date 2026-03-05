// ─── Analytics Service ─────────────────────────────────────────────
// All analytics are computed via MongoDB aggregation pipelines.
// Design decisions:
// 1. ALL aggregation runs server-side (MongoDB) — never pull raw data to Node.js
//    This keeps memory usage minimal and leverages MongoDB's native engine
// 2. All 5 pipelines run in parallel (Promise.all) — total latency = slowest pipeline
// 3. Results are structured for direct consumption by Recharts chart components
// 4. KPIs include resolution rate % and avg resolution time — SLA-level metrics

const Complaint = require("../complaints/complaint.model");

// ─── Dashboard Analytics ───────────────────────────────────────────
// Runs 5 aggregation pipelines in parallel and returns a unified analytics object.
// Called by: GET /api/admin/analytics

const getDashboardAnalytics = async () => {
    // ── Pipeline 1: KPI Summary ──────────────────────────────────────
    // Single-pass aggregation computing all KPI counters in one query
    const kpiPipeline = [
        {
            $facet: {
                // Total complaint count
                total: [{ $count: "count" }],

                // Resolved complaint count
                resolved: [
                    { $match: { status: "Resolved" } },
                    { $count: "count" },
                ],

                // Pending = everything that is NOT resolved or rejected
                pending: [
                    { $match: { status: { $in: ["Submitted", "Under Review", "In Progress"] } } },
                    { $count: "count" },
                ],

                // Critical = urgencyScore 9 or 10
                critical: [
                    { $match: { urgencyScore: { $gte: 9 } } },
                    { $count: "count" },
                ],

                // Average resolution time in hours (only for resolved complaints)
                avgResolutionTime: [
                    { $match: { status: "Resolved", resolvedAt: { $ne: null } } },
                    {
                        $project: {
                            resolutionHours: {
                                $divide: [
                                    { $subtract: ["$resolvedAt", "$createdAt"] },
                                    1000 * 60 * 60, // Convert ms to hours
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            avgHours: { $avg: "$resolutionHours" },
                        },
                    },
                ],
            },
        },
    ];

    // ── Pipeline 2: Complaints by Category ──────────────────────────
    const byCategoryPipeline = [
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } }, // Most common category first
        {
            $project: {
                _id: 0,
                name: "$_id",  // Recharts expects { name, value } shape
                value: "$count",
            },
        },
    ];

    // ── Pipeline 3: Complaints by Status ────────────────────────────
    const byStatusPipeline = [
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                name: "$_id",
                value: "$count",
            },
        },
    ];

    // ── Pipeline 4: Complaints by Urgency Label ──────────────────────
    const byUrgencyPipeline = [
        {
            $group: {
                _id: "$urgencyLabel",
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                name: "$_id",
                value: "$count",
            },
        },
    ];

    // ── Pipeline 5: Complaints by Department ────────────────────────
    const byDepartmentPipeline = [
        {
            $group: {
                _id: "$department",
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        {
            $project: {
                _id: 0,
                name: "$_id",
                value: "$count",
            },
        },
    ];

    // ── Run all pipelines in parallel ───────────────────────────────
    // Total response time = slowest pipeline (not sum of all)
    const [kpiResult, byCategory, byStatus, byUrgency, byDepartment] =
        await Promise.all([
            Complaint.aggregate(kpiPipeline),
            Complaint.aggregate(byCategoryPipeline),
            Complaint.aggregate(byStatusPipeline),
            Complaint.aggregate(byUrgencyPipeline),
            Complaint.aggregate(byDepartmentPipeline),
        ]);

    // ── Extract + format KPI values ──────────────────────────────────
    const facet = kpiResult[0];
    const total = facet.total[0]?.count || 0;
    const resolved = facet.resolved[0]?.count || 0;
    const pending = facet.pending[0]?.count || 0;
    const critical = facet.critical[0]?.count || 0;
    const avgHoursRaw = facet.avgResolutionTime[0]?.avgHours;

    // Resolution rate as a percentage (0 when no complaints exist)
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Round to 1 decimal — "34.5 hours" is more useful than "34.4872..."
    const avgResolutionTimeHours = avgHoursRaw
        ? Math.round(avgHoursRaw * 10) / 10
        : null;

    // ── Recent Complaints ─────────────────────────────────────────────
    // Fetched separately — not an aggregation, just a query with projection
    const recentComplaints = await Complaint.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("citizen", "name")
        .select(
            "trackingId title category urgencyScore urgencyLabel status department createdAt citizen"
        );

    return {
        kpis: {
            total,
            resolved,
            pending,
            critical,
            resolutionRate,         // Percentage 0–100
            avgResolutionTimeHours, // Hours (null if no resolved complaints)
        },
        byCategory,
        byStatus,
        byUrgency,
        byDepartment,
        recentComplaints,
    };
};

module.exports = { getDashboardAnalytics };
