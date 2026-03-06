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
        `flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors duration-100 no-underline ` +
        (isActive ? 'text-[#111827] bg-[#F3F4F6] shadow-sm border border-[#E5E7EB]' : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] border border-transparent');

    return (
        <nav className="sticky top-0 z-50 h-[64px] bg-white border-b border-[#E5E7EB] flex items-center px-6 gap-8 shadow-sm">

            {/* Logo */}
            <div className="flex items-center gap-2.5 flex-shrink-0 border-r border-[#E5E7EB] pr-6">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                <span className="text-[16px] font-bold text-[#111827] tracking-tight">CivicSense Admin</span>
            </div>

            {/* Nav links */}
            <div className="flex items-center gap-1.5">
                <NavLink to="/admin/dashboard" end className={navLinkClass}>
                    <LayoutGrid className="w-4 h-4" /> Overview
                </NavLink>
                <NavLink to="/admin/analytics" className={navLinkClass}>
                    <BarChart2 className="w-4 h-4" /> Analytics
                </NavLink>
                {user?.role === 'admin' && (
                    <>
                        <NavLink to="/admin/officers" className={navLinkClass}>
                            <Users className="w-4 h-4" /> Team
                        </NavLink>
                        <NavLink to="/admin/settings" className={navLinkClass}>
                            <Settings className="w-4 h-4" /> Settings
                        </NavLink>
                    </>
                )}
            </div>

            {/* Right side */}
            <div className="ml-auto flex items-center gap-4">

                <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ` +
                    (user?.role === 'admin'
                        ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                        : 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]')}>
                    {user?.role === 'admin' ? 'Super Admin' : 'Field Officer'}
                </span>

                <div className="h-5 w-px bg-[#E5E7EB] hidden sm:block" />

                <div className="hidden sm:flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm ` +
                        (user?.role === 'admin' ? 'bg-[#111827]' : 'bg-[#059669]')}>
                        {initials}
                    </div>
                    <span className="text-[13px] font-medium text-[#374151]">{user?.name}</span>
                </div>

                <button onClick={handleLogout}
                    className="w-9 h-9 rounded-md border border-transparent hover:border-[#E5E7EB] bg-transparent flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-all ml-1"
                    title="Sign Out">
                    <LogOut size={16} />
                </button>
            </div>
        </nav>
    );
}
