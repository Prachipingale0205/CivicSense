import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Signed out");
        navigate("/");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">CS</span>
                    </div>
                    <span className="text-base font-semibold text-gray-900">CivicSense</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/track" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        Track
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/submit" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                Submit
                            </Link>
                            <Link to="/my-complaints" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                My Complaints
                            </Link>
                            <span className="text-sm text-gray-400">|</span>
                            <span className="text-sm text-gray-600">{user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-red-500 hover:text-red-600 transition-colors"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                Sign in
                            </Link>
                            <Link to="/register" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Get started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
