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
            const res = await api.get('/api/admin/complaints');
            setComplaints(res.data.complaints || res.data || []);
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
        const map = { Critical: 'border-l-red-500', High: 'border-l-orange-400', Medium: 'border-l-amber-400', Low: 'border-l-emerald-400' };
        return map[label] || 'border-l-gray-200';
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
        <div className="min-h-screen bg-background">
            <TopNav />

            <main className="px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Complaints</h1>
                        <p className="text-[14px] text-gray-500 mt-0.5">
                            {isAdminRole ? `${activeCount} active · sorted by urgency` : `${activeCount} active · your assigned complaints`}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text" value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                placeholder="Search..."
                                className="input-field w-44 lg:w-64 pl-9 shadow-soft-sm"
                            />
                        </div>
                        <button className="btn-secondary h-10 shadow-soft-sm">
                            <SlidersHorizontal size={16} /> Filter
                        </button>
                        {isAdminRole && (
                            <button className="btn-primary">
                                <Download size={16} /> Export
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setPage(1); }}
                            className={`px-4 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 -mb-px transition-all duration-200 ${activeTab === tab ? 'text-primary-600 border-primary-600' : 'text-gray-400 border-transparent hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab}
                            <span className={`ml-2 text-[11px] px-2 py-0.5 rounded-full font-semibold ${activeTab === tab ? 'bg-primary-50 text-primary-700' : 'bg-gray-100 text-gray-500'
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
                    <div className="card py-16 text-center">
                        <FileX className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-[15px] text-gray-500 font-medium">No complaints found</p>
                        <button onClick={() => { setActiveTab('All'); setSearchQuery(''); setPage(1); }}
                            className="mt-3 text-[14px] text-primary-600 hover:text-primary-700 hover:underline font-semibold transition-colors">
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="card overflow-hidden">
                        {/* Table header */}
                        <div className="hidden lg:grid grid-cols-[90px_110px_1fr_110px_100px_80px_90px_80px] bg-gray-50/80 border-b border-gray-200/60">
                            <button onClick={() => handleSort('urgencyScore')} className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-3.5 py-2.5 hover:text-gray-600 transition-colors">
                                Urgency <SortIcon field="urgencyScore" />
                            </button>
                            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-3.5 py-2.5">ID</div>
                            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-3.5 py-2.5">Title</div>
                            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-3.5 py-2.5">Category</div>
                            <button onClick={() => handleSort('status')} className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-3.5 py-2.5 hover:text-gray-600 transition-colors">
                                Status <SortIcon field="status" />
                            </button>
                            <button onClick={() => handleSort('createdAt')} className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-3.5 py-2.5 hover:text-gray-600 transition-colors">
                                Date <SortIcon field="createdAt" />
                            </button>
                            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-3.5 py-2.5">Officer</div>
                            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-3.5 py-2.5">Actions</div>
                        </div>

                        {/* Rows */}
                        {paginatedComplaints.map((c, idx) => (
                            <div
                                key={c._id}
                                onClick={() => openPanel(c)}
                                className={`lg:grid lg:grid-cols-[90px_110px_1fr_110px_100px_80px_90px_80px] items-center border-b border-gray-100 hover:bg-primary-50/30 cursor-pointer transition-all duration-150 border-l-2 ${urgencyBorder(c.urgencyLabel)}`}
                                style={{ animation: `fadeIn 0.2s ease both`, animationDelay: `${idx * 0.04}s` }}
                            >
                                {/* Mobile */}
                                <div className="lg:hidden p-3.5 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <UrgencyBadge label={c.urgencyLabel} />
                                        <StatusBadge status={c.status} />
                                    </div>
                                    <p className="text-[13px] font-medium text-gray-900">{c.title}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-[10.5px] text-gray-400">{c.trackingId}</span>
                                        <span className="text-[10.5px] text-gray-400">
                                            {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Desktop */}
                                <div className="hidden lg:block px-3.5 py-3"><UrgencyBadge label={c.urgencyLabel} /></div>
                                <div className="hidden lg:block px-3.5 py-3 font-mono text-[10.5px] text-gray-400">{c.trackingId}</div>
                                <div className="hidden lg:block px-3.5 py-3 text-[13px] font-medium text-gray-900 truncate">{c.title}</div>
                                <div className="hidden lg:block px-3.5 py-3">
                                    <span className="text-[11px] bg-gray-50 border border-gray-200 rounded-md px-1.5 py-0.5 text-gray-500">{c.category}</span>
                                </div>
                                <div className="hidden lg:block px-3.5 py-3"><StatusBadge status={c.status} /></div>
                                <div className="hidden lg:block px-3.5 py-3 text-[11px] text-gray-400">
                                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </div>
                                <div className="hidden lg:block px-3.5 py-3 text-[11px] text-gray-500 truncate">
                                    {c.officer || <span className="italic text-gray-300">—</span>}
                                </div>
                                <div className="hidden lg:flex px-3.5 py-3 items-center gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); openPanel(c); }}
                                        className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-200">
                                        <Eye size={13} />
                                    </button>
                                    {isAdminRole && (
                                        <>
                                            <button onClick={(e) => e.stopPropagation()}
                                                className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-200">
                                                <UserPlus size={13} />
                                            </button>
                                            <button onClick={(e) => e.stopPropagation()}
                                                className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-200">
                                                <MoreHorizontal size={13} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/80">
                            <span className="text-[12px] text-gray-400">
                                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredComplaints.length)}–{Math.min(page * PAGE_SIZE, filteredComplaints.length)} of {filteredComplaints.length}
                            </span>
                            <div className="flex gap-1.5">
                                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                    className="btn-secondary h-7 px-3 text-[12px] disabled:opacity-40 disabled:pointer-events-none">
                                    Prev
                                </button>
                                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                                    className="btn-secondary h-7 px-3 text-[12px] disabled:opacity-40 disabled:pointer-events-none">
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
