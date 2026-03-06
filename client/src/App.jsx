import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./store/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SubmitComplaint from "./pages/citizen/SubmitComplaint";
import MyComplaints from "./pages/citizen/MyComplaints";
import TrackComplaint from "./pages/citizen/TrackComplaint";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Analytics from "./pages/admin/Analytics";

// Smart redirect — send logged-in users to right place
const HomeRedirect = () => {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated) return <LandingPage />;
    if (user?.role === "admin" || user?.role === "officer") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/submit" replace />;
};

export default function App() {
    return (
        <AuthProvider>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Routes>
                {/* Public */}
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/track" element={<TrackComplaint />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Citizen protected */}
                <Route path="/submit" element={
                    <ProtectedRoute requiredRole="citizen">
                        <SubmitComplaint />
                    </ProtectedRoute>
                } />
                <Route path="/my-complaints" element={
                    <ProtectedRoute requiredRole="citizen">
                        <MyComplaints />
                    </ProtectedRoute>
                } />

                {/* Admin/Officer protected */}
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute redirectTo="/admin/login" allowedRoles={["admin", "officer"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                    <ProtectedRoute redirectTo="/admin/login" allowedRoles={["admin", "officer"]}>
                        <Analytics />
                    </ProtectedRoute>
                } />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}
