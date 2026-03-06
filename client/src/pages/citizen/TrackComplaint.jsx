import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
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
            const res = await api.get(`/api/complaints/${trackingId.trim()}`);
            const complaint = res.data.data.complaint;
            setResult(complaint);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Complaint not found. Check tracking ID.');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-sans">
            <Navbar />

            {/* Blue Top Background */}
            <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-[#EFF6FF] to-transparent -z-10 pointer-events-none" />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
                <div className="text-center mb-10 max-w-xl mx-auto">
                    <h1 className="text-3xl font-bold text-[#111827] tracking-tight mb-3">Track Ticket Status</h1>
                    <p className="text-[15px] text-[#4B5563] leading-relaxed">
                        Enter your unique 12-character Ticket ID below to track real-time routing, assignment, and resolution progress.
                    </p>
                </div>

                {/* Search Box */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 sm:p-8 mb-8">
                    <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                            <input
                                type="text"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                placeholder="e.g. CSV-9A8B-7C6D"
                                required
                                className="w-full h-12 border border-[#D1D5DB] rounded-xl pl-12 pr-4 text-[15px] font-mono uppercase tracking-wide focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:normal-case placeholder:tracking-normal placeholder:font-sans placeholder:text-[#9CA3AF] text-[#111827] bg-[#F9FAFB] hover:bg-white shadow-sm inset-y-0"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-12 px-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-[15px] font-semibold transition-all shadow-sm flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track Status'}
                        </button>
                    </form>
                </div>

                {/* Result Tracking View */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm"
                        >
                            {/* Header block */}
                            <div className="px-6 py-5 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-[13px] font-bold tracking-widest text-[#111827]">
                                            {result.trackingId}
                                        </span>
                                        <div className="h-4 w-px bg-[#D1D5DB]" />
                                        <span className="text-[13px] text-[#6B7280]">
                                            Reported on {new Date(result.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <UrgencyBadge label={result.urgencyLabel} />
                                        <StatusBadge status={result.status} />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-8">
                                {/* Left Col: Static Data */}
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Complaint Title</p>
                                        <h2 className="text-[16px] font-bold text-[#111827] leading-snug">{result.title}</h2>
                                    </div>
                                    {result.description && (
                                        <div>
                                            <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Description</p>
                                            <p className="text-[14px] text-[#4B5563] leading-relaxed">{result.description}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Attributes</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="text-[12px] font-medium bg-[#F3F4F6] text-[#374151] px-2.5 py-1 rounded inline-flex">
                                                {result.category}
                                            </span>
                                            <span className="text-[12px] font-medium bg-[#EFF6FF] text-[#1D4ED8] px-2.5 py-1 rounded inline-flex">
                                                Dept: {result.department}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Col: Timeline */}
                                <div className="md:col-span-3">
                                    <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 h-full">
                                        <h3 className="text-[13px] font-semibold text-[#374151] uppercase tracking-wider mb-5 border-b border-[#E5E7EB] pb-3">Resolution Timeline</h3>
                                        <div className="pl-1">
                                            <StatusTimeline statusHistory={result.statusHistory || []} />
                                        </div>
                                    </div>
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
