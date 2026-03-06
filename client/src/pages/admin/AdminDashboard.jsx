import { useState, useEffect, useMemo } from 'react';
import {
    Search,
    SlidersHorizontal,
    Download,
    Eye,
    UserPlus,
    MoreHorizontal,
    ChevronUp,
    ChevronDown,
    FileX,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import TopNav from '../../components/admin/TopNav';
import ComplaintDetailPanel from '../../components/admin/ComplaintDetailPanel';
import UrgencyBadge from '../../components/shared/UrgencyBadge';
import StatusBadge from '../../components/shared/StatusBadge';
import SkeletonCard from '../../components/shared/SkeletonCard';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TABS = ['All', 'Critical', 'High', 'Pending Assignment', 'Resolved Today'];
const PAGE_SIZE = 25;

export default function AdminDashboard() {
    const { user } = useAuth();
    const isAdminRole = user?.role === 'admin';

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [sortField, setSortField] = useState('urgencyScore');
    const [sortDir, setSortDir] = useState('desc');
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => { fetchComplaints(); }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/admin/complaints?sortBy=urgencyScore&order=desc&limit=50");
            const { complaints } = res.data.data;
            setComplaints(complaints);
        } catch (err) {
            toast.error('Failed to load complaints.');
        } finally {
            setLoading(false);
        }
    };

    const filteredComplaints = useMemo(() => {
        let list = [...complaints];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter((c) => c.title.toLowerCase().includes(q) || c.trackingId.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
        }
        if (activeTab === 'Critical') list = list.filter((c) => c.urgencyLabel === 'Critical');
        else if (activeTab === 'High') list = list.filter((c) => c.urgencyLabel === 'High');
        else if (activeTab === 'Pending Assignment') list = list.filter((c) => !c.officer);
        else if (activeTab === 'Resolved Today') {
            const today = new Date().toDateString();
            list = list.filter((c) => c.status === 'Resolved' && c.statusHistory?.some((h) => h.status === 'Resolved' && new Date(h.date).toDateString() === today));
        }
        list.sort((a, b) => {
            let aVal = a[sortField], bVal = b[sortField];
            if (sortField === 'createdAt') { aVal = new Date(aVal).getTime(); bVal = new Date(bVal).getTime(); }
            if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
            if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
            return aVal < bVal ? 1 : -1;
        });
        return list;
    }, [complaints, searchQuery, activeTab, sortField, sortDir]);

    const paginatedComplaints = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredComplaints.slice(start, start + PAGE_SIZE);
    }, [filteredComplaints, page]);

    const totalPages = Math.ceil(filteredComplaints.length / PAGE_SIZE);

    const handleSort = (field) => {
        if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        else { setSortField(field); setSortDir('desc'); }
    };

    const openPanel = (complaint) => { setSelectedComplaint(complaint); setIsPanelOpen(true); };

    const handleStatusUpdate = (updated) => {
        setComplaints((prev) => prev.map((c) => (c._id === updated._id ? { ...c, ...updated } : c)));
        setSelectedComplaint(updated);
    };

    const urgencyBorder = (label) => {
        const map = { Critical: 'border-l-[#dc2626]', High: 'border-l-[#ea580c]', Medium: 'border-l-[#d97706]', Low: 'border-l-[#16a34a]' };
        return map[label] || 'border-l-[#e8e8e6]';
    };

    const tabCounts = useMemo(() => ({
        All: complaints.length,
        Critical: complaints.filter((c) => c.urgencyLabel === 'Critical').length,
        High: complaints.filter((c) => c.urgencyLabel === 'High').length,
        'Pending Assignment': complaints.filter((c) => !c.officer).length,
        'Resolved Today': (() => { const today = new Date().toDateString(); return complaints.filter((c) => c.status === 'Resolved' && c.statusHistory?.some((h) => h.status === 'Resolved' && new Date(h.date).toDateString() === today)).length; })(),
    }), [complaints]);

    const activeCount = complaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Rejected').length;

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline ml-0.5" /> : <ChevronDown className="w-3 h-3 inline ml-0.5" />;
    };

    return (
        <div className="min-h-screen bg-[#f9f9f8]">
            <TopNav />

            <main className="px-6 lg:px-8 py-5 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Complaints</h1>
                        <p className="text-[14px] text-[#6B7280] mt-0.5">
                            {isAdminRole ? `${activeCount} active · sorted by urgency` : `${activeCount} active · your assigned complaints`}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                            <input
                                type="text" value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                placeholder="Search..."
                                className="w-44 lg:w-64 h-10 border border-[#D1D5DB] rounded-lg pl-9 pr-3 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 shadow-sm"
                            />
                        </div>
                        <button className="h-10 px-3 border border-[#D1D5DB] rounded-lg text-[14px] font-medium text-[#4B5563] hover:border-[#9CA3AF] hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2 bg-white shadow-sm">
                            <SlidersHorizontal size={16} /> Filter
                        </button>
                        {isAdminRole && (
                            <button className="h-10 px-4 bg-[#2563EB] text-white rounded-lg text-[14px] font-medium hover:bg-[#1D4ED8] transition-colors flex items-center gap-2 shadow-sm">
                                <Download size={16} /> Export
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 border-b border-[#E5E7EB] mb-6 overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setPage(1); }}
                            className={`px-4 py-2 text-[14px] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${activeTab === tab ? 'text-[#2563EB] border-[#2563EB]' : 'text-[#6B7280] border-transparent hover:text-[#111827] hover:border-[#D1D5DB]'
                                }`}
                        >
                            {tab}
                            <span className={`ml-2 text-[11px] px-2 py-0.5 rounded-full font-semibold ${activeTab === tab ? 'bg-[#DBEAFE] text-[#1D4ED8]' : 'bg-[#F3F4F6] text-[#6B7280]'
                                }`}>
                                {tabCounts[tab]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Table */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} compact lines={2} />)}
                    </div>
                ) : paginatedComplaints.length === 0 ? (
                    <div className="bg-white rounded-xl border border-[#E5E7EB] py-16 text-center shadow-sm">
                        <FileX className="w-12 h-12 text-[#D1D5DB] mx-auto mb-3" />
                        <p className="text-[15px] text-[#4B5563] font-medium">No complaints found</p>
                        <button onClick={() => { setActiveTab('All'); setSearchQuery(''); setPage(1); }}
                            className="mt-3 text-[14px] text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-semibold">
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
                        {/* Table header */}
                        <div className="hidden lg:grid grid-cols-[90px_110px_1fr_110px_100px_80px_90px_80px] bg-[#f9f9f8] border-b border-[#e8e8e6]">
                            <button onClick={() => handleSort('urgencyScore')} className="text-left text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wide px-3.5 py-2.5 hover:text-[#52525b]">
                                Urgency <SortIcon field="urgencyScore" />
                            </button>
                            <div className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wide px-3.5 py-2.5">ID</div>
                            <div className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wide px-3.5 py-2.5">Title</div>
                            <div className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wide px-3.5 py-2.5">Category</div>
                            <button onClick={() => handleSort('status')} className="text-left text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wide px-3.5 py-2.5 hover:text-[#52525b]">
                                Status <SortIcon field="status" />
                            </button>
                            <button onClick={() => handleSort('createdAt')} className="text-left text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wide px-3.5 py-2.5 hover:text-[#52525b]">
                                Date <SortIcon field="createdAt" />
                            </button>
                            <div className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wide px-3.5 py-2.5">Officer</div>
                            <div className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wide px-3.5 py-2.5">Actions</div>
                        </div>

                        {/* Rows */}
                        {paginatedComplaints.map((c, idx) => (
                            <div
                                key={c._id}
                                onClick={() => openPanel(c)}
                                className={`lg:grid lg:grid-cols-[90px_110px_1fr_110px_100px_80px_90px_80px] items-center border-b border-[#e8e8e6] hover:bg-[#fafaf9] cursor-pointer transition-colors border-l-2 ${urgencyBorder(c.urgencyLabel)}`}
                                style={{ animation: `fadeIn 0.2s ease both`, animationDelay: `${idx * 0.04}s` }}
                            >
                                {/* Mobile */}
                                <div className="lg:hidden p-3.5 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <UrgencyBadge label={c.urgencyLabel} />
                                        <StatusBadge status={c.status} />
                                    </div>
                                    <p className="text-[13px] font-medium text-[#18181b]">{c.title}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-[10.5px] text-[#a1a1aa]">{c.trackingId}</span>
                                        <span className="text-[10.5px] text-[#a1a1aa]">
                                            {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Desktop */}
                                <div className="hidden lg:block px-3.5 py-3"><UrgencyBadge label={c.urgencyLabel} /></div>
                                <div className="hidden lg:block px-3.5 py-3 font-mono text-[10.5px] text-[#a1a1aa]">{c.trackingId}</div>
                                <div className="hidden lg:block px-3.5 py-3 text-[13px] font-medium text-[#18181b] truncate">{c.title}</div>
                                <div className="hidden lg:block px-3.5 py-3">
                                    <span className="text-[11px] bg-[#f9f9f8] border border-[#e8e8e6] rounded px-1.5 py-0.5 text-[#52525b]">{c.category}</span>
                                </div>
                                <div className="hidden lg:block px-3.5 py-3"><StatusBadge status={c.status} /></div>
                                <div className="hidden lg:block px-3.5 py-3 text-[11px] text-[#a1a1aa]">
                                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </div>
                                <div className="hidden lg:block px-3.5 py-3 text-[11px] text-[#52525b] truncate">
                                    {c.officer || <span className="italic text-[#a1a1aa]">—</span>}
                                </div>
                                <div className="hidden lg:flex px-3.5 py-3 items-center gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); openPanel(c); }}
                                        className="w-7 h-7 rounded border border-[#e8e8e6] bg-transparent flex items-center justify-center text-[#a1a1aa] hover:bg-[#f9f9f8] hover:text-[#18181b] hover:border-[#d8d8d4] transition-colors">
                                        <Eye size={13} />
                                    </button>
                                    {isAdminRole && (
                                        <>
                                            <button onClick={(e) => e.stopPropagation()}
                                                className="w-7 h-7 rounded border border-[#e8e8e6] bg-transparent flex items-center justify-center text-[#a1a1aa] hover:bg-[#f9f9f8] hover:text-[#18181b] hover:border-[#d8d8d4] transition-colors">
                                                <UserPlus size={13} />
                                            </button>
                                            <button onClick={(e) => e.stopPropagation()}
                                                className="w-7 h-7 rounded border border-[#e8e8e6] bg-transparent flex items-center justify-center text-[#a1a1aa] hover:bg-[#f9f9f8] hover:text-[#18181b] hover:border-[#d8d8d4] transition-colors">
                                                <MoreHorizontal size={13} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-4 py-3 border-t border-[#e8e8e6] bg-[#f9f9f8]">
                            <span className="text-[12px] text-[#a1a1aa]">
                                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredComplaints.length)}–{Math.min(page * PAGE_SIZE, filteredComplaints.length)} of {filteredComplaints.length}
                            </span>
                            <div className="flex gap-1.5">
                                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                    className="h-7 px-2.5 border border-[#d8d8d4] rounded bg-white text-[12px] font-medium text-[#52525b] hover:border-[#18181b] hover:text-[#18181b] disabled:opacity-40 disabled:pointer-events-none transition-colors">
                                    Prev
                                </button>
                                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                                    className="h-7 px-2.5 border border-[#d8d8d4] rounded bg-white text-[12px] font-medium text-[#52525b] hover:border-[#18181b] hover:text-[#18181b] disabled:opacity-40 disabled:pointer-events-none transition-colors">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <ComplaintDetailPanel
                complaint={selectedComplaint}
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onStatusUpdate={handleStatusUpdate}
            />
        </div>
    );
}
