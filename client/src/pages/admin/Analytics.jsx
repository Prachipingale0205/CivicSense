import { useState, useEffect } from 'react';
import {
    BarChart2,
    CheckCircle,
    AlertTriangle,
    Zap,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area,
} from 'recharts';
import { useAuth } from '../../store/AuthContext';
import TopNav from '../../components/admin/TopNav';
import SkeletonCard from '../../components/shared/SkeletonCard';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    Resolved: '#10B981',      // Emerald 500
    'In Progress': '#2563EB', // Blue 600
    'Under Review': '#F59E0B',// Amber 500
    Submitted: '#9CA3AF',     // Gray 400
    Rejected: '#EF4444',      // Red 500
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-lg px-4 py-3 text-[13px]">
            <p className="font-semibold text-[#6B7280] mb-1">{label}</p>
            <p className="text-[#111827] font-bold text-lg">{payload[0]?.value}</p>
        </div>
    );
};

const DATE_RANGES = ['7 Days', '30 Days', 'All Time'];

export default function Analytics() {
    const { user } = useAuth();
    const isAdminRole = user?.role === 'admin';

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30 Days');

    useEffect(() => { fetchAnalytics(); }, [dateRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/analytics', { params: { range: dateRange.toLowerCase().replace(' ', '') } });
            setData(res.data);
        } catch (err) {
            toast.error('Failed to load analytics.');
        } finally {
            setLoading(false);
        }
    };

    const totalByStatus = data?.byStatus?.reduce((sum, s) => sum + s.count, 0) || 0;

    const allKpiCards = data ? [
        { label: 'TOTAL COMPLAINTS', value: data.summary.total, icon: BarChart2, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', valueColor: 'text-[#111827]', trend: '+12%', trendUp: true, adminOnly: false },
        { label: 'RESOLVED TODAY', value: data.summary.resolvedToday, icon: CheckCircle, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', valueColor: 'text-emerald-600', trend: '+3', trendUp: true, adminOnly: false },
        { label: 'CRITICAL PENDING', value: data.summary.criticalPending, icon: AlertTriangle, iconBg: 'bg-red-50', iconColor: 'text-red-600', valueColor: 'text-red-600', trend: '-2', trendUp: false, adminOnly: true },
        { label: 'RESOLUTION RATE', value: `${data.summary.resolutionRate}%`, icon: Zap, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', valueColor: 'text-[#111827]', trend: '+5%', trendUp: true, adminOnly: true },
    ] : [];

    const kpiCards = isAdminRole ? allKpiCards : allKpiCards.filter(c => !c.adminOnly);

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-sans">
            <TopNav />

            <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Analytics</h1>
                        <p className="text-[14px] text-[#6B7280] mt-1">
                            {isAdminRole ? 'System-wide civic intelligence report' : 'Your department complaint trends'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {DATE_RANGES.map((range) => (
                            <button key={range} onClick={() => setDateRange(range)}
                                className={`h-9 px-4 rounded-lg text-[13px] font-semibold transition-colors shadow-sm ${dateRange === range
                                    ? 'bg-[#111827] text-white'
                                    : 'bg-white border border-[#D1D5DB] text-[#4B5563] hover:border-[#9CA3AF] hover:text-[#111827]'
                                    }`}>
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Officer info banner */}
                {!isAdminRole && (
                    <div className="mb-6 px-5 py-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[13px] text-emerald-800 font-medium flex items-center gap-2 shadow-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Showing analytics specifically tailored for your assigned departmental zone.
                    </div>
                )}

                {loading ? (
                    <div className="space-y-6">
                        <div className={`grid gap-5 ${isAdminRole ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
                            {(isAdminRole ? [1, 2, 3, 4] : [1, 2]).map((i) => <SkeletonCard key={i} lines={2} />)}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SkeletonCard lines={8} />
                            <SkeletonCard lines={8} />
                        </div>
                    </div>
                ) : data ? (
                    <>
                        {/* KPI Cards */}
                        <div className={`grid gap-5 mb-8 ${isAdminRole ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
                            {kpiCards.map((card) => (
                                <div key={card.label} className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
                                    <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">{card.label}</p>
                                    <div className="flex items-end justify-between">
                                        <p className={`text-4xl font-bold tracking-tight leading-none ${card.valueColor}`}>
                                            {card.value}
                                        </p>
                                        <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shadow-sm`}>
                                            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#F3F4F6]">
                                        {card.trendUp ? <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" /> : <TrendingDown className="w-3.5 h-3.5 text-[#EF4444]" />}
                                        <span className={`text-[12px] font-bold ${card.trendUp ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{card.trend}</span>
                                        <span className="text-[12px] font-medium text-[#9CA3AF]">vs previous period</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Row 1 */}
                        <div className={`grid gap-6 mb-6 ${isAdminRole ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-2'}`}>
                            {/* Bar Chart - visible to both */}
                            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
                                <h3 className="text-[16px] font-bold text-[#111827] mb-1">Incoming Categories</h3>
                                <p className="text-[13px] text-[#6B7280] mb-6">Distribution across primary civic issue categories</p>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={data.byCategory} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
                                        <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Donut Chart - admin only / Area Chart for officer */}
                            {isAdminRole ? (
                                <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
                                    <h3 className="text-[16px] font-bold text-[#111827] mb-1">Status Breakdown</h3>
                                    <p className="text-[13px] text-[#6B7280] mb-6">Real-time status of tracked complaints</p>
                                    <div className="relative">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie data={data.byStatus} cx="50%" cy="50%" innerRadius={80} outerRadius={110} dataKey="count" stroke="none">
                                                    {data.byStatus.map((entry) => (
                                                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#9CA3AF'} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend wrapperStyle={{ fontSize: 12, paddingTop: '20px' }} iconType="circle" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ marginTop: '-40px' }}>
                                            <span className="text-4xl font-extrabold text-[#111827] mb-1">{totalByStatus}</span>
                                            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Total</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
                                    <h3 className="text-[16px] font-bold text-[#111827] mb-1">Inflow Trend</h3>
                                    <p className="text-[13px] text-[#6B7280] mb-6">Daily complaint volume over time</p>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={data.overTime} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} dy={10} />
                                            <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={3} fill="#EFF6FF" fillOpacity={1} dot={{ r: 4, fill: '#2563EB', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>

                        {/* Charts Row 2 - admin only */}
                        {isAdminRole && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Area Chart */}
                                <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
                                    <h3 className="text-[16px] font-bold text-[#111827] mb-1">Inflow Trend</h3>
                                    <p className="text-[13px] text-[#6B7280] mb-6">Daily complaint volume over time</p>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={data.overTime} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} dy={10} />
                                            <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={3} fill="url(#colorCount)" fillOpacity={1} dot={{ r: 4, fill: '#2563EB', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Horizontal Bar */}
                                <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
                                    <h3 className="text-[16px] font-bold text-[#111827] mb-1">Avg Resolution Time</h3>
                                    <p className="text-[13px] text-[#6B7280] mb-6">Average hours taken by department</p>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={data.byDepartment} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                            <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                            <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12, fontMedium: true, fill: '#374151' }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
                                            <Bar dataKey="avgHours" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={18} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </>
                ) : null}
            </main>
        </div>
    );
}
