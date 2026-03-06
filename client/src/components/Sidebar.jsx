import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import toast from "react-hot-toast";

const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "⊞" },
    { path: "/admin/analytics", label: "Analytics", icon: "↗" },
];

export default function Sidebar() {
    const { pathname } = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Signed out");
        navigate("/admin/login");
    };

    return (
        <aside className="fixed top-0 left-0 h-full w-64 bg-gray-950 flex flex-col z-40">
            {/* Logo */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-800">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">CS</span>
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">CivicSense</p>
                    <p className="text-xs text-gray-500">Admin Portal</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ path, label, icon }) => {
                    const active = pathname === path;
                    return (
                        <Link key={path} to={path}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                                }`}
                        >
                            <span>{icon}</span>
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* User footer */}
            <div className="px-4 py-4 border-t border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                    Sign out
                </button>
            </div>
        </aside>
    );
}
