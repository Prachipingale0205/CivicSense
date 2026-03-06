import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Eye, Inbox } from 'lucide-react';
import Navbar from '../../components/citizen/Navbar';
import ChatbotWidget from '../../components/citizen/ChatbotWidget';
import UrgencyBadge from '../../components/shared/UrgencyBadge';
import StatusBadge from '../../components/shared/StatusBadge';
import StatusTimeline from '../../components/shared/StatusTimeline';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/complaints/user');
            setComplaints(res.data.data?.complaints || res.data.data || []);
        } catch (err) {
            toast.error('Failed to load your complaints.');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const filteredComplaints = complaints.filter(
        (c) =>
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.trackingId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-sans">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                {/* Header & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Track My Complaints</h1>
                        <p className="text-[14px] text-[#6B7280] mt-1">
                            Monitor the live status and history of your reported issues.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                            <input
                                type="text"
                                placeholder="Search by Ticket ID or Title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 border border-[#D1D5DB] rounded-lg pl-9 pr-3 text-[14px] focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-[#9CA3AF] text-[#111827] bg-white shadow-sm"
                            />
                        </div>
                        <button className="h-10 px-3 border border-[#D1D5DB] bg-white rounded-lg text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB] hover:border-[#9CA3AF] transition-colors shadow-sm flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="text-[13px] font-medium hidden sm:block">Filter</span>
                        </button>
                    </div>
                </div>

                {/* Complaint List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 bg-white border border-[#E5E7EB] rounded-xl animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : filteredComplaints.length === 0 ? (
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center shadow-sm">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Inbox className="w-6 h-6" />
                        </div>
                        <p className="text-[#111827] font-semibold text-lg">No complaints found</p>
                        <p className="text-[#6B7280] text-[14px] mt-1 mb-6 max-w-sm mx-auto">
                            You haven't submitted any complaints yet, or your search didn't match any records.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredComplaints.map((complaint) => {
                            const isExpanded = expandedId === complaint._id;
                            return (
                                <div
                                    key={complaint._id}
                                    className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => toggleExpand(complaint._id)}
                                >
                                    {/* Card Header ( zawsze widoczny ) */}
                                    <div className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-mono text-[11px] font-semibold tracking-wider text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded">
                                                    {complaint.trackingId}
                                                </span>
                                                <UrgencyBadge label={complaint.urgencyLabel} />
                                                <span className="text-[12px] text-[#9CA3AF]">
                                                    {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <h3 className="text-[16px] font-semibold text-[#111827] mb-1.5 line-clamp-1">
                                                {complaint.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#4B5563]">
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" /> {complaint.location}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB]" /> {complaint.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 self-start w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-[#F3F4F6] sm:border-0">
                                            <StatusBadge status={complaint.status} />
                                            <button
                                                className="text-[13px] font-medium text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleExpand(complaint._id);
                                                }}
                                            >
                                                {isExpanded ? 'Hide Details' : 'View Timeline'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Timeline Section */}
                                    {isExpanded && (
                                        <div className="px-5 sm:px-6 py-6 bg-[#F8FAFC] border-t border-[#E5E7EB]">
                                            <h4 className="text-[13px] font-semibold text-[#374151] uppercase tracking-wider mb-5 flex items-center gap-2">
                                                <span className="bg-[#E2E8F0] w-2 h-2 rounded-full" /> Case Lifecycle
                                            </h4>
                                            <div className="pl-2">
                                                <StatusTimeline statusHistory={complaint.statusHistory || []} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <ChatbotWidget />
        </div>
    );
}
