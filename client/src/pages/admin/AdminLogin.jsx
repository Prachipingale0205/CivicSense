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
            const { token, user } = res.data;
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
        <div className="min-h-screen bg-background flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-[420px] bg-white rounded-2xl border border-gray-200/60 p-8 sm:p-10 shadow-soft-lg">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2.5 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm">
                            <span className="text-white text-[10px] font-black">CS</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">CivicSense</span>
                    </div>
                    <p className="text-[14px] text-gray-500 font-medium">Admin & Officer Portal</p>
                </div>

                {error && (
                    <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg text-[13px] font-medium text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="admin@example.com"
                            className="input-field-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="input-field-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full h-11 text-[14px] mt-2"
                    >
                        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</> : 'Sign In to Portal'}
                    </button>
                </form>
            </div>
        </div>
    );
}
