import { Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { User, LogOut, FileText } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="sticky top-0 z-50 h-[64px] bg-white border-b border-[#E5E7EB] flex items-center px-4 sm:px-8 shadow-sm">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                    <span className="text-[17px] font-bold text-[#111827] tracking-tight">CivicSense</span>
                </Link>

                {/* Links */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <Link
                                to="/submit"
                                className="hidden sm:flex items-center gap-1.5 px-4 h-9 text-[13px] font-medium text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-md transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                New Complaint
                            </Link>
                            <Link
                                to="/my-complaints"
                                className="px-4 h-9 flex items-center bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] rounded-md text-[13px] font-medium transition-colors border border-[#E5E7EB]"
                            >
                                Track Status
                            </Link>
                            <div className="h-4 w-px bg-[#E5E7EB] mx-1 hidden sm:block" />
                            <div className="hidden sm:flex items-center gap-2 px-2">
                                <div className="w-7 h-7 rounded-full bg-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center text-[11px] font-bold">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="text-[13px] font-medium text-[#374151]">{user.name}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="w-9 h-9 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-md transition-colors"
                                title="Log out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 h-9 flex items-center text-[13px] font-medium text-[#4B5563] hover:text-[#111827] transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/submit"
                                className="px-5 h-9 flex items-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-md text-[13px] font-medium transition-colors shadow-sm"
                            >
                                File a Complaint
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
