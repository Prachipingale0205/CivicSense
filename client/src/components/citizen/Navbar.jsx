import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { LogOut, Plus, LayoutList, Search } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 h-14 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 flex items-center px-4 sm:px-6 shadow-nav">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                        <span className="text-white text-[11px] font-black tracking-tight">CS</span>
                    </div>
                    <span className="text-[15px] font-bold text-gray-900 tracking-tight">CivicSense</span>
                </Link>

                {/* Nav Links */}
                {user && (
                    <div className="hidden sm:flex items-center gap-0.5 ml-8">
                        <Link
                            to="/submit"
                            className={`nav-link ${isActive('/submit') ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            New Report
                        </Link>
                        <Link
                            to="/my-complaints"
                            className={`nav-link ${isActive('/my-complaints') ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            <LayoutList className="w-3.5 h-3.5" />
                            My Tickets
                        </Link>
                        <Link
                            to="/track"
                            className={`nav-link ${isActive('/track') ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            <Search className="w-3.5 h-3.5" />
                            Track
                        </Link>
                    </div>
                )}

                {/* Right Side */}
                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            <div className="hidden sm:flex items-center gap-2.5 mr-1 border border-gray-200/80 bg-gray-50/80 rounded-lg px-3 py-1.5">
                                <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="text-[12px] font-medium text-gray-700 max-w-[100px] truncate">{user.name}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Log out"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-3 h-8 flex items-center text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/submit"
                                className="btn-primary h-8 px-4 text-[12px]"
                            >
                                File a Report
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
