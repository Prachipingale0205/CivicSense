import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/citizen/Navbar';
import ChatbotWidget from '../../components/citizen/ChatbotWidget';
import StatusBadge from '../../components/shared/StatusBadge';
import UrgencyBadge from '../../components/shared/UrgencyBadge';
import StatusTimeline from '../../components/shared/StatusTimeline';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function TrackComplaint() {
    const [trackingId, setTrackingId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!trackingId.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const res = await api.get(`/api/complaints/track/${trackingId}`);
            setResult(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Complaint not found. Check tracking ID.');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />

            <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-5">
                    <Link to="/" className="hover:text-gray-600 transition-colors duration-200">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-600 font-medium">Track</span>
                </div>

                <div className="mb-8">
                    <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Track a complaint</h1>
                    <p className="text-[14px] text-gray-500 mt-1">Enter your tracking ID to check the current status and resolution timeline.</p>
                </div>

                {/* Search */}
                <form onSubmit={handleTrack} className="flex gap-2 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text" value={trackingId} onChange={(e) => setTrackingId(e.target.value)}
                            placeholder="e.g. CSV-9A8B-7C6D" required
                            className="input-field pl-10 font-mono uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal placeholder:font-sans"
                        />
                    </div>
                    <button type="submit" disabled={loading}
                        className="btn-primary min-w-[100px]">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Track'}
                    </button>
                </form>

                {/* Result */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="card overflow-hidden"
                        >
                            {/* Header */}
                            <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50">
                                <div className="flex items-center gap-2.5">
                                    <span className="font-mono text-[12px] font-semibold text-gray-900">{result.trackingId}</span>
                                    <span className="text-gray-300">·</span>
                                    <span className="text-[12px] text-gray-500">
                                        {new Date(result.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <UrgencyBadge label={result.urgencyLabel} />
                                    <StatusBadge status={result.status} />
                                </div>
                            </div>

                            <div className="p-5 space-y-5">
                                {/* Details */}
                                <div>
                                    <h2 className="text-[16px] font-semibold text-gray-900 mb-1.5">{result.title}</h2>
                                    {result.description && (
                                        <p className="text-[13px] text-gray-500 leading-relaxed">{result.description}</p>
                                    )}
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        <span className="badge bg-gray-100 text-gray-600 border border-gray-200">{result.category}</span>
                                        <span className="badge bg-primary-50 text-primary-700 border border-primary-200">{result.department}</span>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="border-t border-gray-100 pt-5">
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">Resolution Timeline</p>
                                    <StatusTimeline statusHistory={result.statusHistory || []} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <ChatbotWidget />
        </div>
    );
}
