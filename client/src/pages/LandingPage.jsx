import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Bot, Activity, CheckCircle, Shield, Building2 } from 'lucide-react';
import Navbar from '../components/citizen/Navbar';

const features = [
    {
        icon: FileText,
        title: 'Easy Submission',
        desc: 'Describe your issue in plain language. Add location details naturally without complex forms.',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        icon: Bot,
        title: 'AI Intelligence',
        desc: 'Our system automatically categorizes your complaint, assesses urgency, and extracts key details.',
        color: 'bg-teal-50 text-teal-600',
    },
    {
        icon: Activity,
        title: 'Automatic Routing',
        desc: 'Complaints are instantly forwarded to the correct municipal department based on AI classification.',
        color: 'bg-purple-50 text-purple-600',
    },
];

const stats = [
    { value: '2M+', label: 'Complaints Tracked' },
    { value: '<24h', label: 'Average Triage Time' },
    { value: '98%', label: 'Routing Accuracy' },
    { value: '150+', label: 'Cities Covered' },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 font-sans">
            <Navbar />

            <main>
                {/* Soft Background Gradient for Hero */}
                <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-white -z-10" />

                {/* Hero Section */}
                <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[13px] font-medium mb-8 shadow-sm">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        CivicPlatform 3.0 is Live
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
                        Modern civic intelligence for <br className="hidden sm:block" />
                        <span className="text-[#2563EB]">smarter communities.</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-[#4B5563] mb-10 max-w-2xl mx-auto leading-relaxed">
                        Report local issues naturally. Our AI-driven platform instantly categorizes, prioritizes, and routes your complaint to the right municipal authority.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/submit"
                            className="w-full sm:w-auto px-8 h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                        >
                            Start a Report
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/track"
                            className="w-full sm:w-auto px-8 h-12 bg-white border border-[#D1D5DB] text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111827] rounded-lg text-sm font-medium flex items-center justify-center transition-all shadow-sm"
                        >
                            Track Status
                        </Link>
                    </div>
                </section>


                {/* Stats Section */}
                <section className="border-y border-gray-200 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-200">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center px-4">
                                    <p className="text-3xl font-bold text-[#111827] tracking-tight">{stat.value}</p>
                                    <p className="text-sm font-medium text-[#6B7280] mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features / How It Works */}
                <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#111827] tracking-tight mb-4">How CivicSense Works</h2>
                        <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
                            Our platform bridges the gap between citizens and local government with a streamlined, intelligent workflow.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {features.map((feature) => (
                            <div key={feature.title} className="relative group">
                                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 shadow-sm`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#111827] mb-3">{feature.title}</h3>
                                <p className="text-[#4B5563] leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white py-12 text-center">
                <p className="text-sm text-gray-500 font-medium flex items-center justify-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    © 2024 CivicSense. CodeCraze 3.0 Prototype.
                </p>
            </footer>
        </div>
    );
}
