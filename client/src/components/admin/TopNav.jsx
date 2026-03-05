import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { LogOut, LayoutGrid, BarChart2, Users, Settings } from 'lucide-react';

export default function TopNav() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : 'U';

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navLinkClass = ({ isActive }) =>
        `nav-link ` +
        (isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50');

    return (
        <nav className="sticky top-0 z-50 h-14 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 flex items-center px-4 sm:px-6 shadow-nav">

            {/* Logo */}
            <div className="flex items-center gap-2.5 flex-shrink-0 mr-6">
                <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white text-[10px] font-black">CS</span>
                </div>
                <div>
                    <span className="text-[14px] font-bold text-gray-900 block leading-none tracking-tight">CivicSense</span>
                    <span className="text-[10px] text-gray-400 font-medium">Admin</span>
                </div>
            </div>

            {/* Separator */}
            <div className="h-5 w-px bg-gray-200 mr-4 hidden sm:block" />

            {/* Nav links */}
            <div className="flex items-center gap-0.5">
                <NavLink to="/admin/dashboard" end className={navLinkClass}>
                    <LayoutGrid className="w-3.5 h-3.5" /> Overview
                </NavLink>
                <NavLink to="/admin/analytics" className={navLinkClass}>
                    <BarChart2 className="w-3.5 h-3.5" /> Analytics
                </NavLink>
                {user?.role === 'admin' && (
                    <>
                        <NavLink to="/admin/officers" className={navLinkClass}>
                            <Users className="w-3.5 h-3.5" /> Team
                        </NavLink>
                        <NavLink to="/admin/settings" className={navLinkClass}>
                            <Settings className="w-3.5 h-3.5" /> Settings
                        </NavLink>
                    </>
                )}
            </div>

            {/* Right side */}
            <div className="ml-auto flex items-center gap-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ` +
                    (user?.role === 'admin' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200')}>
                    {user?.role === 'admin' ? 'Admin' : 'Officer'}
                </span>

                <div className="hidden sm:flex items-center gap-2.5 border border-gray-200/80 bg-gray-50/80 rounded-lg px-3 py-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ` +
                        (user?.role === 'admin' ? 'bg-gray-900' : 'bg-emerald-600')}>
                        {initials}
                    </div>
                    <span className="text-[12px] font-medium text-gray-700 max-w-[100px] truncate">{user?.name}</span>
                </div>

                <button onClick={handleLogout}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                    title="Sign Out">
                    <LogOut size={14} />
                </button>
            </div>
        </nav>
    );
}
