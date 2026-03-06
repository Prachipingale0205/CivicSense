import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            if (user.role !== 'admin' && user.role !== 'officer') {
                setError('Access denied. Admin or officer credentials required.');
                setLoading(false);
                return;
            }
            login(token, user);
            toast.success('Welcome, ' + user.name + '!');
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-[420px] bg-white rounded-2xl border border-[#E5E7EB] p-8 sm:p-10 shadow-sm">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-[#2563EB]" />
                        <span className="text-xl font-bold text-[#111827] tracking-tight">CivicSense</span>
                    </div>
                    <p className="text-[14px] text-[#6B7280] font-medium">Admin & Officer Portal</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg text-[13px] font-medium text-[#DC2626]">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="admin@example.com"
                            className="w-full h-11 border border-[#D1D5DB] rounded-lg px-4 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 transition-all bg-[#F9FAFB] hover:bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full h-11 border border-[#D1D5DB] rounded-lg px-4 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 transition-all bg-[#F9FAFB] hover:bg-white"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-[14px] font-semibold transition-all shadow-sm disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</> : 'Sign In to Portal'}
                    </button>
                </form>
            </div>
        </div>
    );
}
