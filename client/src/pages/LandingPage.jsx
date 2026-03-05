import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Cpu, Route, CheckCircle, Users, Clock, Zap, Building2 } from 'lucide-react';
import Navbar from '../components/citizen/Navbar';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            <main>
                {/* Hero */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1 rounded-full shadow-soft-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                                Live on 150+ municipalities
                            </span>
                        </div>

                        <h1 className="text-[40px] sm:text-[52px] font-extrabold text-gray-900 tracking-[-0.03em] leading-[1.08] mb-5">
                            Civic complaints,
                            <br />
                            <span className="text-primary-600">handled intelligently.</span>
                        </h1>

                        <p className="text-[17px] text-gray-500 leading-relaxed max-w-lg mb-8">
                            Report local issues in plain language. Our system categorizes, assigns urgency scores, and routes to the right municipal department — automatically.
                        </p>

                        <div className="flex items-center gap-3">
                            <Link
                                to="/submit"
                                className="btn-primary h-11 px-6 text-[14px]"
                            >
                                Report an Issue
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/track"
                                className="btn-secondary h-11 px-6 text-[14px]"
                            >
                                Track a Complaint
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="border-y border-gray-100 bg-gray-50/60">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
                            <Stat icon={Users} value="2M+" label="reports processed" />
                            <Stat icon={Clock} value="<24h" label="avg. triage time" />
                            <Stat icon={Zap} value="98%" label="routing accuracy" />
                            <Stat icon={CheckCircle} value="87%" label="resolution rate" />
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="max-w-lg mb-12">
                        <p className="text-[12px] font-bold text-primary-600 uppercase tracking-wider mb-2">How it works</p>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">Three steps. No municipal office visits.</h2>
                        <p className="text-[15px] text-gray-500 leading-relaxed">
                            Submit your complaint once. We handle the rest — from classification to department routing.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200/80 rounded-xl overflow-hidden border border-gray-200/80 shadow-card">
                        <StepCard
                            number="01"
                            icon={FileText}
                            title="Describe the Issue"
                            desc="Write a short description. Add location. No forms, no bureaucracy."
                        />
                        <StepCard
                            number="02"
                            icon={Cpu}
                            title="AI Triage"
                            desc="The system reads your complaint, classifies it, assigns an urgency score, and picks the right department."
                        />
                        <StepCard
                            number="03"
                            icon={Route}
                            title="Auto-Routing"
                            desc="Your complaint lands on the assigned officer's dashboard with full context. You get a tracking ID."
                        />
                    </div>
                </section>
            </main>

            <footer className="border-t border-gray-100 bg-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <p className="text-[12px] text-gray-400 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        © 2024 CivicSense · CodeCraze 3.0
                    </p>
                    <div className="flex items-center gap-4 text-[12px] text-gray-400">
                        <Link to="/admin/login" className="hover:text-gray-600 transition-colors duration-200">Admin</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function Stat({ icon: Icon, value, label }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span className="text-[15px] font-bold text-gray-900 tabular-nums">{value}</span>
            <span className="text-[13px] text-gray-500">{label}</span>
        </div>
    );
}

function StepCard({ number, icon: Icon, title, desc }) {
    return (
        <div className="bg-white p-6 sm:p-8 hover:bg-gray-50/50 transition-colors duration-300 group">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-bold text-gray-200 tabular-nums">{number}</span>
                <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 group-hover:shadow-sm transition-all duration-300">
                    <Icon className="w-[18px] h-[18px] text-primary-600" />
                </div>
            </div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}
