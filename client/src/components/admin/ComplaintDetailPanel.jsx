import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, MapPin } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import UrgencyBadge from '../shared/UrgencyBadge';
import StatusBadge from '../shared/StatusBadge';
import StatusTimeline from '../shared/StatusTimeline';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ComplaintDetailPanel({ complaint, isOpen, onClose, onStatusUpdate }) {
    const { user } = useAuth();
    const isAdminRole = user?.role === 'admin';
    const [status, setStatus] = useState(complaint?.status || 'Submitted');
    const [updating, setUpdating] = useState(false);

    if (!complaint) return null;

    const handleStatusUpdate = async () => {
        setUpdating(true);
        try {
            const res = await api.put(`/api/admin/complaints/${complaint._id}/status`, {
                status,
                note: `Status updated to ${status}`,
            });
            toast.success('Status updated successfully');
            onStatusUpdate?.(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const scoreColor = () => {
        const s = complaint.urgencyScore;
        if (s >= 8) return 'text-red-600';
        if (s >= 6) return 'text-amber-500';
        if (s >= 4) return 'text-orange-500';
        return 'text-emerald-600';
    };

    const sentimentEmoji = (label) => {
        const map = { Frustrated: '😤', Neutral: '😐', Urgent: '🚨', Angry: '😡', Satisfied: '😊' };
        return map[label] || '😐';
    };

    const statusOptions = isAdminRole
        ? ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected']
        : ['Under Review', 'In Progress', 'Resolved'];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white border-l border-gray-200/60 z-50 flex flex-col shadow-float font-sans"
                    >
                        {/* Header */}
                        <div className="border-b border-gray-200/60 p-5 flex items-center justify-between flex-shrink-0 bg-gray-50/80">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-[12px] font-semibold bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg shadow-soft-sm">
                                    {complaint.trackingId}
                                </span>
                                <UrgencyBadge label={complaint.urgencyLabel} />
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <section>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Complaint Details</p>
                                <h2 className="text-[18px] font-bold text-gray-900 leading-snug tracking-tight">{complaint.title}</h2>
                                <p className="text-[14px] text-gray-500 mt-3 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="text-[12px] font-medium bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-gray-600">{complaint.category}</span>
                                    <span className="text-[12px] font-medium bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 text-emerald-700">{complaint.department}</span>
                                    <span className="text-[12px] font-medium bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-gray-500">
                                        {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                    {complaint.location && (
                                        <span className="text-[12px] font-medium bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1 text-blue-700 flex items-center gap-1">
                                            <MapPin size={12} /> {complaint.location}
                                        </span>
                                    )}
                                </div>
                            </section>

                            <section className="bg-gradient-to-br from-gray-50 to-white border border-gray-200/80 rounded-xl p-5 shadow-card">
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">AI Intelligence Analysis</p>
                                <div className="flex items-center gap-5">
                                    <span className={`text-[44px] font-extrabold leading-none tracking-tighter ${scoreColor()}`}>{complaint.urgencyScore}</span>
                                    <div>
                                        <UrgencyBadge label={complaint.urgencyLabel} />
                                        {complaint.sentiment && (
                                            <p className="text-[13px] font-medium mt-1.5 text-gray-500 flex items-center gap-1.5">
                                                <span>{sentimentEmoji(complaint.sentiment)}</span> {complaint.sentiment} Tone
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {complaint.aiSummary && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-[13px] text-gray-500 leading-relaxed">{complaint.aiSummary}</p>
                                    </div>
                                )}
                            </section>

                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status Timeline</p>
                                    <StatusBadge status={complaint.status} />
                                </div>
                                <StatusTimeline statusHistory={complaint.statusHistory || []} />
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200/60 p-5 bg-gray-50/80 flex-shrink-0 space-y-3">
                            <div className="flex flex-col gap-2 mb-2">
                                <label className="text-[12px] font-semibold text-gray-500">Update Status</label>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="flex-1 h-10 border border-gray-200 rounded-lg px-3 text-[14px] text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-600/10 focus:outline-none bg-white shadow-soft-sm transition-all duration-200 hover:border-gray-300 cursor-pointer"
                                    >
                                        {statusOptions.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleStatusUpdate}
                                        disabled={updating}
                                        className="btn-primary h-10 px-5 whitespace-nowrap"
                                    >
                                        {updating ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update Status'}
                                    </button>
                                </div>
                            </div>
                            {isAdminRole && (
                                <button className="w-full h-9 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-[13px] font-semibold transition-all duration-200 shadow-soft-sm hover:shadow-sm">
                                    Reject & Internal Dismiss
                                </button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
