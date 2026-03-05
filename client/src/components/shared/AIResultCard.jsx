import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, CheckCircle2, Factory, AlertCircle } from 'lucide-react';
import UrgencyBadge from './UrgencyBadge';

export default function AIResultCard({ category, department, urgencyScore, urgencyLabel, trackingId, aiSummary }) {
    const [copied, setCopied] = useState(false);
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        if (urgencyScore == null) return;
        let current = 0;
        const target = urgencyScore;
        const steps = 25;
        const increment = target / steps;
        const interval = 800 / steps;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) { setAnimatedScore(target); clearInterval(timer); }
            else setAnimatedScore(Math.round(current * 10) / 10);
        }, interval);
        return () => clearInterval(timer);
    }, [urgencyScore]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(trackingId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* fallback */ }
    };

    const scoreColor = () => {
        if (urgencyScore >= 8) return 'text-red-600';
        if (urgencyScore >= 6) return 'text-amber-600';
        return 'text-emerald-600';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-card"
        >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50">
                <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-[13px] font-semibold text-gray-900">Processed & Routed</span>
                </div>
                <button onClick={handleCopy}
                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">ID</span>
                    <span className="font-mono text-[12px] font-medium text-gray-900">{trackingId}</span>
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />}
                </button>
            </div>

            {/* Metrics */}
            <div className="p-6">
                <div className="flex items-start gap-6 mb-5">
                    {/* Score */}
                    <div className="flex-shrink-0">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Score</p>
                        <p className={`text-[40px] font-extrabold tabular-nums leading-none tracking-tighter ${scoreColor()}`}>{animatedScore}</p>
                        <div className="mt-2"><UrgencyBadge label={urgencyLabel} /></div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-4 pt-1">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Category</p>
                                <p className="text-[14px] font-semibold text-gray-900">{category}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Department</p>
                                <p className="text-[14px] font-semibold text-primary-600 flex items-center gap-1.5">
                                    <Factory className="w-3.5 h-3.5" /> {department}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Summary */}
                {aiSummary && (
                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-4">
                        <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" /> AI Analysis
                        </p>
                        <p className="text-[13px] text-emerald-800 leading-relaxed">{aiSummary}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
