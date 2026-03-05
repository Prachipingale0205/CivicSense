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
            const { token, user } = res.data;
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
            const { token, user } = res.data;
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
        <div className="min-h-screen bg-background flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-soft-lg border border-gray-200/60 p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-xl mb-3 shadow-soft-sm">
                        <LogIn className="text-primary-600" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">CivicSense</h1>
                    <p className="text-sm text-gray-500 mt-1">AI-Powered Civic Intelligence</p>
                </div>

                <div className="flex border-b border-gray-200 mb-6 relative">
                    {['login', 'register'].map(t => (
                        <button key={t} onClick={() => { setTab(t); setError(''); }}
                            className={'flex-1 pb-3 text-sm font-medium transition-all duration-200 ' + (tab === t ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-400 hover:text-gray-700')}>
                            {t === 'login' ? 'Sign In' : 'Register'}
                        </button>
                    ))}
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-[13px] font-medium text-red-600">{error}</div>}

                {tab === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                                className="input-field-lg" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                                    className="input-field-lg pr-10" />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="btn-primary w-full h-11 text-[14px]">
                            {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</> : 'Sign In'}
                        </button>
                    </form>
                )}

                {tab === 'register' && (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your full name"
                                className="input-field-lg" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                                className="input-field-lg" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters"
                                className="input-field-lg" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="btn-primary w-full h-11 text-[14px]">
                            {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</> : 'Create Account'}
                        </button>
                    </form>
                )}

                <p className="text-center text-xs text-gray-400 mt-6">
                    {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); }} className="text-primary-600 hover:text-primary-700 hover:underline font-medium transition-colors">
                        {tab === 'login' ? 'Register' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
}
