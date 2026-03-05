import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, FileText, Bot, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/citizen/Navbar';
import ChatbotWidget from '../../components/citizen/ChatbotWidget';
import AIResultCard from '../../components/shared/AIResultCard';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AI_STEPS = [
    "Analyzing complaint semantics...",
    "Evaluating urgency and public impact...",
    "Classifying category...",
    "Routing to appropriate municipal department..."
];

const CATEGORIES = [
    { value: '', label: 'Auto-detect (recommended)' },
    { value: 'Water Supply', label: 'Water Supply' },
    { value: 'Roads & Infrastructure', label: 'Roads & Infrastructure' },
    { value: 'Electricity', label: 'Electricity' },
    { value: 'Sanitation', label: 'Sanitation' },
    { value: 'Public Safety', label: 'Public Safety' },
    { value: 'Other', label: 'Other' },
];

export default function SubmitComplaint() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiStepIndex, setAiStepIndex] = useState(0);
    const [result, setResult] = useState(null);
    const resultRef = useRef(null);

    useEffect(() => {
        if (!loading) return;
        setAiStepIndex(0);
        const stepTime = 1200 / AI_STEPS.length;
        const interval = setInterval(() => {
            setAiStepIndex(prev => {
                if (prev < AI_STEPS.length - 1) return prev + 1;
                clearInterval(interval);
                return prev;
            });
        }, stepTime);
        return () => clearInterval(interval);
    }, [loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const payload = { title, description, location };
            if (category) payload.category = category;
            const res = await api.post('/api/complaints', payload);
            setResult(res.data);
            toast.success('Complaint submitted successfully!');
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit complaint.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle(''); setDescription(''); setLocation(''); setCategory(''); setResult(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />

            <main className="max-w-[640px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-6">
                    <Link to="/" className="hover:text-gray-600 transition-colors duration-200">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-600 font-medium">New Report</span>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Report a local issue</h1>
                    <p className="text-[14px] text-gray-500 mt-1.5 leading-relaxed">
                        Describe the problem. Our system will analyze, categorize, and route it to the correct department.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                                Issue title <span className="text-gray-400 font-normal">— keep it short</span>
                            </label>
                            <input
                                type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                                placeholder="e.g., Broken water pipe on MG Road"
                                className="input-field"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Description</label>
                            <div className="relative">
                                <textarea
                                    value={description} onChange={(e) => setDescription(e.target.value.slice(0, 500))} required
                                    placeholder="What happened? When did you notice? How severe is it?"
                                    className="w-full min-h-[120px] resize-y border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-600/10 bg-white transition-all duration-200 leading-relaxed hover:border-gray-300"
                                />
                                <span className="absolute bottom-2.5 right-3 text-[11px] text-gray-300 tabular-nums">{description.length}/500</span>
                            </div>
                        </div>

                        {/* Location + Category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text" value={location} onChange={(e) => setLocation(e.target.value)} required
                                        placeholder="Street, area, or landmark"
                                        className="input-field pl-9"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                                    Category <span className="text-gray-400 font-normal text-[11px]">optional</span>
                                </label>
                                <select
                                    value={category} onChange={(e) => setCategory(e.target.value)}
                                    className="input-field cursor-pointer"
                                >
                                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="border-t border-gray-100 pt-5">
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div
                                        key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="w-full h-10 rounded-lg flex items-center border border-primary-100 bg-primary-50/50 overflow-hidden"
                                    >
                                        <div className="h-full w-full relative overflow-hidden flex items-center px-3.5">
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-100/60 to-transparent"
                                                animate={{ x: ['-100%', '100%'] }}
                                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                            />
                                            <div className="flex items-center gap-2.5 relative z-10 w-full text-primary-700">
                                                <Bot className="w-3.5 h-3.5" />
                                                <span className="text-[13px] font-medium">{AI_STEPS[aiStepIndex]}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        key="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        type="submit"
                                        className="btn-primary w-full"
                                    >
                                        Submit Report
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </form>
                </motion.div>

                {/* Result */}
                <AnimatePresence>
                    {result && (
                        <div ref={resultRef} className="mt-8">
                            <div className="flex items-center gap-2.5 mb-4">
                                <h2 className="text-[15px] font-semibold text-gray-900">Processing Result</h2>
                                <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase tracking-wide">Routed</span>
                            </div>

                            <AIResultCard
                                category={result.category} department={result.department}
                                urgencyScore={result.urgencyScore} urgencyLabel={result.urgencyLabel}
                                trackingId={result.trackingId} aiSummary={result.aiSummary}
                            />

                            <div className="flex gap-3 mt-5">
                                <Link to="/my-complaints"
                                    className="btn-secondary flex-1">
                                    View My Tickets
                                </Link>
                                <button onClick={resetForm}
                                    className="btn-secondary flex-1">
                                    File Another
                                </button>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </main>

            <ChatbotWidget />
        </div>
    );
}
