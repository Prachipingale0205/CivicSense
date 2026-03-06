import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black tracking-tight">CS</span>
            </div>
            <span className="text-sm font-bold text-gray-900 tracking-tight">CivicSense</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/track" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Track</Link>
            <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Sign in</Link>
            <Link to="/register" className="bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-700 transition-all">
              Get started →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="pt-36 pb-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">

          {/* Eyebrow */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 border border-gray-200 bg-gray-50 text-gray-600 text-xs font-semibold px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Live on Groq LLaMA 3 · Sub-800ms AI analysis
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-6">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.95] text-gray-900 mb-6">
              2M complaints.<br />
              <span className="text-blue-600">40% ignored.</span><br />
              Not anymore.
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto font-normal">
              CivicSense uses AI to instantly categorize, score urgency, and route every complaint to the right government department — automatically.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3 mt-10 flex-wrap">
            <Link to="/register"
              className="bg-blue-600 text-white text-sm font-bold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              File a complaint →
            </Link>
            <Link to="/track"
              className="border border-gray-200 text-gray-700 text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-all">
              Track existing
            </Link>
          </div>
        </div>
      </section>

      {/* ── AI DEMO CARD ───────────────────────────────────────────── */}
      <section className="pb-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-2xl shadow-gray-100">

            {/* Terminal-style top bar */}
            <div className="bg-gray-950 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-gray-400 text-xs font-mono ml-3">civicsense.ai/analyze</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-400 text-xs font-mono font-semibold">LIVE</span>
              </div>
            </div>

            {/* Input */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Complaint Input</p>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                "Our colony has had no water for 5 days. Elderly residents and children are affected. The municipal office refuses to respond."
              </p>
            </div>

            {/* AI Output Grid */}
            <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 bg-white">
              <div className="px-6 py-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Category</p>
                <p className="text-base font-bold text-gray-900">Water Supply</p>
              </div>
              <div className="px-6 py-5 bg-red-50">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Urgency Score</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-base font-black text-red-600">CRITICAL — 9/10</p>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Routed To</p>
                <p className="text-base font-bold text-gray-900">Water & Sanitation Board</p>
              </div>
              <div className="px-6 py-5 bg-blue-50">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Tracking ID</p>
                <p className="text-base font-mono font-black text-blue-700">GRV-LX4K2M-A9F3</p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-950 px-6 py-3 flex items-center justify-between">
              <span className="text-gray-500 text-xs font-mono">analysis_time: 0.6s</span>
              <span className="text-gray-500 text-xs font-mono">model: llama-3.3-70b-versatile</span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4 font-medium">
            Actual AI output format — generated live from your complaint
          </p>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────── */}
      <section className="py-14 px-6 bg-gray-950">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "2M+",     label: "Annual CPGRAMS complaints" },
            { number: "<800ms",  label: "AI analysis time" },
            { number: "10",      label: "Complaint categories" },
            { number: "9",       label: "Govt. departments covered" },
          ].map(({ number, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-black text-white mb-1">{number}</p>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-3">How it works</p>
            <h2 className="text-4xl font-black tracking-tight text-gray-900">Three steps. One solution.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                number: "01",
                title: "Describe your issue",
                body: "Submit your civic grievance with title, description, and location. Takes under 2 minutes.",
                accent: "bg-blue-600",
              },
              {
                number: "02",
                title: "AI triages instantly",
                body: "Groq LLaMA 3 scores urgency 1–10, detects category, and routes to the right government department in under 800ms.",
                accent: "bg-blue-600",
              },
              {
                number: "03",
                title: "Track to resolution",
                body: "Get a unique tracking ID. Follow every status update with a full immutable audit trail from submission to resolution.",
                accent: "bg-blue-600",
              },
            ].map(({ number, title, body, accent }) => (
              <div key={number} className="group border border-gray-100 rounded-2xl p-8 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300">
                <div className={`w-10 h-10 ${accent} rounded-xl flex items-center justify-center mb-6`}>
                  <span className="text-white text-sm font-black">{number}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── URGENCY SYSTEM ─────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-3">AI Triage System</p>
            <h2 className="text-4xl font-black tracking-tight text-white mb-4">
              Not all complaints are equal.
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              Our AI scores every complaint 1–10 and assigns a priority level. Critical complaints surface immediately — officers never miss an emergency.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Critical", score: "9–10", color: "bg-red-500", textColor: "text-red-400", borderColor: "border-red-900", bg: "bg-red-950", desc: "Immediate action required" },
              { label: "High",     score: "6–8",  color: "bg-orange-500", textColor: "text-orange-400", borderColor: "border-orange-900", bg: "bg-orange-950", desc: "Urgent — same day response" },
              { label: "Medium",   score: "3–5",  color: "bg-yellow-500", textColor: "text-yellow-400", borderColor: "border-yellow-900", bg: "bg-yellow-950", desc: "Resolve within 48 hours" },
              { label: "Low",      score: "1–2",  color: "bg-green-500",  textColor: "text-green-400",  borderColor: "border-green-900",  bg: "bg-green-950",  desc: "Standard processing" },
            ].map(({ label, score, color, textColor, borderColor, bg, desc }) => (
              <div key={label} className={`${bg} border ${borderColor} rounded-2xl p-6`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
                  <span className={`text-sm font-black ${textColor}`}>{label}</span>
                </div>
                <p className="text-2xl font-black text-white mb-2">{score}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-3">Platform</p>
            <h2 className="text-4xl font-black tracking-tight text-gray-900">Built for civic scale</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: "Groq-powered AI Analysis",
                body: "LLaMA 3 scores urgency 1–10, detects category across 10 complaint types, and routes to 1 of 9 government departments. All in under 800ms.",
                tag: "AI",
                tagColor: "bg-blue-100 text-blue-700",
              },
              {
                title: "Immutable Audit Trail",
                body: "Every status update is append-only — never mutated. Full timestamped history from submission to resolution. Production pattern used in banking.",
                tag: "Security",
                tagColor: "bg-green-100 text-green-700",
              },
              {
                title: "Real-time Admin Dashboard",
                body: "Complaints sorted by urgency score descending by default. Officers see Critical complaints in red at the top — zero configuration needed.",
                tag: "Admin",
                tagColor: "bg-purple-100 text-purple-700",
              },
              {
                title: "AI Chatbot for Citizens",
                body: "Citizens ask natural language questions about their complaint status. Groq LLaMA 3 responds with context-aware, empathetic answers instantly.",
                tag: "Chatbot",
                tagColor: "bg-teal-100 text-teal-700",
              },
            ].map(({ title, body, tag, tagColor }) => (
              <div key={title} className="border border-gray-100 rounded-2xl p-8 hover:border-gray-200 hover:shadow-md transition-all duration-200">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-5 ${tagColor}`}>{tag}</span>
                <h3 className="text-base font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ─────────────────────────────────────────────── */}
      <section className="py-12 px-6 border-y border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-10 flex-wrap">
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400">Powered by</p>
          {[
            "Groq LLaMA 3",
            "MongoDB Atlas",
            "Node.js",
            "React 18",
            "Express.js",
            "Render",
          ].map((tech) => (
            <span key={tech} className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-4">Free to use — always</p>
          <h2 className="text-5xl font-black tracking-tight text-gray-900 mb-6 leading-tight">
            Your complaint<br />deserves to be heard.
          </h2>
          <p className="text-gray-500 text-base mb-10 max-w-lg mx-auto leading-relaxed">
            Join citizens using AI to get civic issues resolved faster. File in 2 minutes. Track in real time.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register"
              className="bg-blue-600 text-white text-sm font-bold px-10 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
              Get started — it's free →
            </Link>
            <Link to="/track"
              className="border-2 border-gray-200 text-gray-700 text-sm font-semibold px-10 py-4 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all">
              Track a complaint
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-black">CS</span>
            </div>
            <span className="text-sm text-gray-400 font-medium">
              CivicSense — Team Tech_Exchangers · CodeCraze 3.0 · RCPIT Shirpur
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/track" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Track</Link>
            <Link to="/login" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Sign in</Link>
            <Link to="/admin/login" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Admin</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}