import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ChevronRight, Inbox, ChevronDown, ChevronUp } from 'lucide-react';
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

    useEffect(() => { fetchComplaints(); }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/complaints/my');
            setComplaints(res.data.complaints || res.data || []);
        } catch (err) {
            toast.error('Failed to load your complaints.');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

    const filteredComplaints = complaints.filter(
        (c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.trackingId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-5">
                    <Link to="/" className="hover:text-gray-600 transition-colors duration-200">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-600 font-medium">My Tickets</span>
                </div>

                {/* Header + Search */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">My Tickets</h1>
                        <p className="text-[13px] text-gray-500 mt-0.5">
                            {loading ? 'Loading...' : `${filteredComplaints.length} complaint${filteredComplaints.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                    <div className="relative w-full sm:w-56">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="text" placeholder="Search tickets..." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field h-9 pl-8 pr-3 text-[13px]"
                        />
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-white border border-gray-200/80 rounded-xl skeleton-shimmer" />
                        ))}
                    </div>
                ) : filteredComplaints.length === 0 ? (
                    <div className="card py-16 text-center">
                        <Inbox className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-[14px] text-gray-500 font-medium">No tickets found</p>
                        <p className="text-[12px] text-gray-400 mt-1">You haven't submitted any complaints yet.</p>
                        <Link to="/submit" className="inline-flex items-center mt-4 text-[13px] text-primary-600 hover:text-primary-700 font-medium transition-colors">
                            File a report →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredComplaints.map((complaint) => {
                            const isExpanded = expandedId === complaint._id;
                            return (
                                <div key={complaint._id}
                                    className="card-hover overflow-hidden">
                                    {/* Row */}
                                    <button
                                        onClick={() => toggleExpand(complaint._id)}
                                        className="w-full text-left px-4 py-3.5 flex items-center gap-3"
                                    >
                                        {/* Left border indicator */}
                                        <div className={`w-1 h-10 rounded-full flex-shrink-0 ${complaint.urgencyLabel === 'Critical' ? 'bg-red-500' :
                                            complaint.urgencyLabel === 'High' ? 'bg-orange-400' :
                                                complaint.urgencyLabel === 'Medium' ? 'bg-yellow-400' : 'bg-emerald-400'
                                            }`} />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-[10px] text-gray-400 font-medium">{complaint.trackingId}</span>
                                                <span className="text-[10px] text-gray-300">·</span>
                                                <span className="text-[11px] text-gray-400">
                                                    {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                            <p className="text-[14px] font-medium text-gray-900 truncate">{complaint.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> {complaint.location}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <StatusBadge status={complaint.status} />
                                            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                        </div>
                                    </button>

                                    {/* Expanded Timeline */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 pt-1 border-t border-gray-100 ml-7">
                                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-3">Timeline</p>
                                            <StatusTimeline statusHistory={complaint.statusHistory || []} />
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
