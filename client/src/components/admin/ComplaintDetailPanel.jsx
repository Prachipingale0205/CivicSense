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
            onStatusUpdate?.(res.data.data?.complaint || res.data.data || res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const scoreColor = () => {
        const s = complaint.urgencyScore;
        if (s >= 8) return 'text-[#DC2626]';
        if (s >= 6) return 'text-[#F59E0B]';
        if (s >= 4) return 'text-[#D97706]';
        return 'text-[#10B981]';
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
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white border-l border-[#E5E7EB] z-50 flex flex-col shadow-2xl font-sans"
                    >
                        {/* Header */}
                        <div className="border-b border-[#E5E7EB] p-5 flex items-center justify-between flex-shrink-0 bg-[#F9FAFB]">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-[12px] font-semibold bg-white border border-[#D1D5DB] text-[#4B5563] px-2.5 py-1 rounded-md shadow-sm">
                                    {complaint.trackingId}
                                </span>
                                <UrgencyBadge label={complaint.urgencyLabel} />
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB] transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <section>
                                <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Complaint Details</p>
                                <h2 className="text-[18px] font-bold text-[#111827] leading-snug">{complaint.title}</h2>
                                <p className="text-[14px] text-[#4B5563] mt-3 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="text-[12px] font-medium bg-[#F3F4F6] border border-[#E5E7EB] rounded-md px-2.5 py-1 text-[#4B5563]">{complaint.category}</span>
                                    <span className="text-[12px] font-medium bg-emerald-50 border border-emerald-200 rounded-md px-2.5 py-1 text-emerald-700">{complaint.department}</span>
                                    <span className="text-[12px] font-medium bg-white border border-[#E5E7EB] rounded-md px-2.5 py-1 text-[#6B7280]">
                                        {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                    {complaint.location && (
                                        <span className="text-[12px] font-medium bg-blue-50 border border-blue-200 rounded-md px-2.5 py-1 text-blue-700 flex items-center gap-1">
                                            <MapPin size={12} /> {complaint.location}
                                        </span>
                                    )}
                                </div>
                            </section>

                            <section className="bg-gradient-to-br from-[#F9FAFB] to-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                                <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">AI Intelligence Analysis</p>
                                <div className="flex items-center gap-5">
                                    <span className={`text-[44px] font-extrabold leading-none tracking-tighter ${scoreColor()}`}>{complaint.urgencyScore}</span>
                                    <div>
                                        <UrgencyBadge label={complaint.urgencyLabel} />
                                        {complaint.sentiment && (
                                            <p className="text-[13px] font-medium mt-1.5 text-[#4B5563] flex items-center gap-1.5">
                                                <span>{sentimentEmoji(complaint.sentiment)}</span> {complaint.sentiment} Tone
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {complaint.aiSummary && (
                                    <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
                                        <p className="text-[13px] text-[#4B5563] leading-relaxed">{complaint.aiSummary}</p>
                                    </div>
                                )}
                            </section>

                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Status Timeline</p>
                                    <StatusBadge status={complaint.status} />
                                </div>
                                <StatusTimeline statusHistory={complaint.statusHistory || []} />
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-[#E5E7EB] p-5 bg-[#F9FAFB] flex-shrink-0 space-y-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                            <div className="flex flex-col gap-1.5 mb-2">
                                <label className="text-[12px] font-semibold text-[#4B5563]">Update Status</label>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="flex-1 h-10 border border-[#D1D5DB] rounded-lg px-3 text-[14px] text-[#111827] focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none bg-white shadow-sm transition-all"
                                    >
                                        {statusOptions.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleStatusUpdate}
                                        disabled={updating}
                                        className="h-10 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-[14px] font-semibold transition-all disabled:opacity-70 flex items-center gap-2 shadow-sm whitespace-nowrap"
                                    >
                                        {updating ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update Status'}
                                    </button>
                                </div>
                            </div>
                            {isAdminRole && (
                                <button className="w-full h-9 bg-white border border-[#FECACA] hover:bg-[#FEF2F2] text-[#DC2626] rounded-lg text-[13px] font-semibold transition-colors shadow-sm">
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
