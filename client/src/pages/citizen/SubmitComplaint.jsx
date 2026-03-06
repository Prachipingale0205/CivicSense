import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Loader2, FileText, Bot } from 'lucide-react';
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

export default function SubmitComplaint() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');

    const [loading, setLoading] = useState(false);
    const [aiStepIndex, setAiStepIndex] = useState(0);
    const [result, setResult] = useState(null);

    const resultRef = useRef(null);

    // AI steps progression effect
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
            const res = await api.post("/api/complaints", { title, description, location });
            const data = res.data.data;
            setResult(data);
            toast.success('Complaint submitted successfully!');

            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit complaint.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setLocation('');
        setCategory('');
        setResult(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-sans">
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-4 shadow-sm">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#111827] tracking-tight">Report a Local Issue</h1>
                    <p className="text-[#6B7280] mt-2 max-w-lg mx-auto text-[15px]">
                        Describe your complaint in detail. Our automated triage system will analyze and route it to the correct municipal department.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 sm:p-10 mb-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-[#374151] mb-2">
                                Log Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Brief summary of the issue (e.g., Pothole on MG Road)"
                                className="w-full h-11 border border-[#D1D5DB] rounded-lg px-4 text-[15px] focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-[#9CA3AF] text-[#111827] bg-[#F9FAFB] hover:bg-white"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-[#374151] mb-2">Description</label>
                            <div className="relative">
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                                    required
                                    placeholder="Provide detailed information. Our system uses this text to establish urgency and categorization."
                                    className="w-full min-h-[140px] resize-y border border-[#D1D5DB] rounded-lg px-4 py-3 text-[15px] focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-[#9CA3AF] text-[#111827] bg-[#F9FAFB] hover:bg-white leading-relaxed"
                                />
                                <span className="absolute bottom-3 right-4 text-[11px] font-medium text-[#9CA3AF]">
                                    {description.length} / 500
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2 border-b border-[#F3F4F6] mb-6">
                            {/* Location */}
                            <div className="pb-6">
                                <label className="block text-sm font-semibold text-[#374151] mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        required
                                        placeholder="Specific street or landmark"
                                        className="w-full h-11 border border-[#D1D5DB] rounded-lg pl-10 pr-4 text-[15px] focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-[#9CA3AF] text-[#111827] bg-[#F9FAFB] hover:bg-white"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="pb-6">
                                <label className="block text-sm font-semibold text-[#374151] mb-2 flex items-center justify-between">
                                    Category <span className="text-[#9CA3AF] font-normal text-xs">Optional</span>
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full h-11 border border-[#D1D5DB] rounded-lg px-4 text-[15px] focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-[#111827] bg-[#F9FAFB] hover:bg-white cursor-pointer"
                                >
                                    <option value="">Auto-Detect via Logic... ✧</option>
                                    <option value="Water Supply">Water Supply</option>
                                    <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                                    <option value="Electricity">Electricity</option>
                                    <option value="Sanitation">Sanitation</option>
                                    <option value="Public Safety">Public Safety</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full h-12 rounded-lg flex items-center border border-[#E5E7EB] bg-[#F9FAFB] overflow-hidden"
                                    >
                                        <div className="h-full bg-blue-50 w-full relative overflow-hidden flex items-center px-4">
                                            {/* Shimmer overlay */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent"
                                                animate={{ x: ['-100%', '100%'] }}
                                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                            />
                                            <div className="flex items-center gap-3 relative z-10 w-full text-blue-700">
                                                <Bot className="w-4 h-4" />
                                                <span className="text-sm font-medium">
                                                    {AI_STEPS[aiStepIndex]}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        key="submit"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        type="submit"
                                        className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-[15px] font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        Submit for Processing
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </form>
                </motion.div>

                {/* Result Area */}
                <AnimatePresence>
                    {result && (
                        <div ref={resultRef}>
                            <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
                                Processed Results <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase px-2 py-0.5 rounded font-bold tracking-wider">Automated Dispatch</span>
                            </h2>

                            <AIResultCard
                                category={result.category}
                                department={result.department}
                                urgencyScore={result.urgencyScore}
                                urgencyLabel={result.urgencyLabel}
                                trackingId={result.trackingId}
                                aiSummary={result.aiSummary}
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex gap-4 mt-6"
                            >
                                <Link
                                    to="/my-complaints"
                                    className="flex-1 h-11 bg-white border border-[#D1D5DB] hover:bg-[#F9FAFB] text-[#374151] rounded-lg text-sm font-semibold transition-all flex items-center justify-center shadow-sm"
                                >
                                    View My Tickets
                                </Link>
                                <button
                                    onClick={resetForm}
                                    className="flex-1 h-11 bg-white border border-[#D1D5DB] hover:bg-[#F9FAFB] text-[#374151] rounded-lg text-sm font-semibold transition-all shadow-sm"
                                >
                                    File Another Complaint
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>

            <ChatbotWidget />
        </div>
    );
}
