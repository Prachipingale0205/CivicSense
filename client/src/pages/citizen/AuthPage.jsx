import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AuthPage() {
    const [tab, setTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/api/auth/login', { email, password });
            const { token, user } = res.data.data;
            login(token, user);
            toast.success('Welcome, ' + user.name + '!');
            navigate(user.role === 'admin' || user.role === 'officer' ? '/admin/dashboard' : '/submit');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            const res = await api.post('/api/auth/register', { name, email, password });
            const { token, user } = res.data.data;
            login(token, user);
            toast.success('Welcome, ' + user.name + '!');
            navigate('/submit');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-3">
                        <LogIn className="text-blue-600" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-[#111827]">CivicSense</h1>
                    <p className="text-sm text-[#6B7280] mt-1">AI-Powered Civic Intelligence</p>
                </div>

                <div className="flex border-b border-[#E5E7EB] mb-6">
                    {['login', 'register'].map(t => (
                        <button key={t} onClick={() => { setTab(t); setError(''); }}
                            className={'flex-1 pb-3 text-sm font-medium transition-colors ' + (tab === t ? 'border-b-2 border-[#2563EB] text-[#2563EB]' : 'text-[#6B7280] hover:text-[#111827]')}>
                            {t === 'login' ? 'Sign In' : 'Register'}
                        </button>
                    ))}
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

                {tab === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-1.5">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                                className="w-full h-11 border border-[#D1D5DB] rounded-lg px-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 bg-[#F9FAFB]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-1.5">Password</label>
                            <div className="relative">
                                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                                    className="w-full h-11 border border-[#D1D5DB] rounded-lg px-4 pr-10 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 bg-[#F9FAFB]" />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563]">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                            {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</> : 'Sign In'}
                        </button>
                    </form>
                )}

                {tab === 'register' && (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-1.5">Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your full name"
                                className="w-full h-11 border border-[#D1D5DB] rounded-lg px-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 bg-[#F9FAFB]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-1.5">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                                className="w-full h-11 border border-[#D1D5DB] rounded-lg px-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 bg-[#F9FAFB]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-1.5">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters"
                                className="w-full h-11 border border-[#D1D5DB] rounded-lg px-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 bg-[#F9FAFB]" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                            {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</> : 'Create Account'}
                        </button>
                    </form>
                )}

                <p className="text-center text-xs text-[#9CA3AF] mt-6">
                    {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); }} className="text-[#2563EB] hover:underline font-medium">
                        {tab === 'login' ? 'Register' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
}
