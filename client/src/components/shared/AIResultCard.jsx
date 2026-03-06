import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, CheckCircle2, Factory, Hash, AlertCircle, FileText } from 'lucide-react';
import UrgencyBadge from './UrgencyBadge';

export default function AIResultCard({ category, department, urgencyScore, urgencyLabel, trackingId, aiSummary }) {
    const [copied, setCopied] = useState(false);
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        if (urgencyScore == null) return;
        let current = 0;
        const target = urgencyScore;
        const duration = 800;
        const steps = 30;
        const increment = target / steps;
        const interval = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setAnimatedScore(target);
                clearInterval(timer);
            } else {
                setAnimatedScore(Math.round(current * 10) / 10);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [urgencyScore]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(trackingId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
        }
    };

    const scoreColor = () => {
        if (urgencyScore >= 8) return 'text-[#DC2626]'; // Red
        if (urgencyScore >= 6) return 'text-[#D97706]'; // Amber
        return 'text-[#059669]'; // Emerald
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden"
        >
            {/* Header */}
            <div className="bg-[#F8FAFC] border-b border-[#E5E7EB] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                        Report Categorized & Routed
                    </h3>
                    <p className="text-[13px] text-[#6B7280] mt-1 ml-7">System has successfully processed your submission.</p>
                </div>

                {/* Tracking ID Copy */}
                <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 shadow-sm self-start sm:self-auto">
                    <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Ticket ID</span>
                    <span className="font-mono text-[13px] font-medium text-[#111827] border-l border-[#E5E7EB] pl-3 ml-1">
                        {trackingId}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="ml-2 text-[#9CA3AF] hover:text-[#111827] transition-colors p-1"
                        title="Copy Ticket ID"
                    >
                        {copied ? <Check className="w-4 h-4 text-[#059669]" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    {/* Score */}
                    <div>
                        <div className="flex items-center gap-1.5 mb-2 text-[#6B7280]">
                            <AlertCircle className="w-4 h-4" />
                            <p className="text-[12px] font-semibold uppercase tracking-wider">Calculated Score</p>
                        </div>
                        <p className={`text-4xl font-bold tracking-tight ${scoreColor()} leading-none`}>{animatedScore}</p>
                    </div>

                    {/* Priority */}
                    <div>
                        <div className="flex items-center gap-1.5 mb-2.5 text-[#6B7280]">
                            <Hash className="w-4 h-4" />
                            <p className="text-[12px] font-semibold uppercase tracking-wider">Priority Level</p>
                        </div>
                        <UrgencyBadge label={urgencyLabel} />
                    </div>

                    {/* Category */}
                    <div>
                        <div className="flex items-center gap-1.5 mb-2.5 text-[#6B7280]">
                            <FileText className="w-4 h-4" />
                            <p className="text-[12px] font-semibold uppercase tracking-wider">Category</p>
                        </div>
                        <p className="text-[14px] font-medium text-[#111827] truncate" title={category}>{category}</p>
                    </div>

                    {/* Department */}
                    <div>
                        <div className="flex items-center gap-1.5 mb-2.5 text-[#6B7280]">
                            <Factory className="w-4 h-4" />
                            <p className="text-[12px] font-semibold uppercase tracking-wider">Forwarded To</p>
                        </div>
                        <p className="text-[14px] font-medium text-[#2563EB] truncate" title={department}>{department}</p>
                    </div>
                </div>

                {/* AI Summary */}
                {aiSummary && (
                    <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4">
                        <p className="text-[11px] font-semibold text-[#16A34A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> AI Summary Note
                        </p>
                        <p className="text-[14px] text-[#065F46] leading-relaxed">
                            {aiSummary}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
