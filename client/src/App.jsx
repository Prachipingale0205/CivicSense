import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './store/AuthContext';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/citizen/AuthPage';
import SubmitComplaint from './pages/citizen/SubmitComplaint';
import MyComplaints from './pages/citizen/MyComplaints';
import TrackComplaint from './pages/citizen/TrackComplaint';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Analytics from './pages/admin/Analytics';

function ProtectedRoute({ children, allowedRoles }) {
    const { token, user, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
    if (!token) return <Navigate to="/login" replace />;
    if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
}

function AdminRoute({ children }) {
    const { user, token, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
    if (!token || !user) return <Navigate to="/admin/login" replace />;
    if (user.role !== 'admin' && user.role !== 'officer') return <Navigate to="/" replace />;
    return children;
}

function AnimatedPage({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
        >
            {children}
        </motion.div>
    );
}

export default function App() {
    const location = useLocation();

    return (
        <>
            <Toaster position="top-right" />
            <AnimatePresence mode="wait" initial={false}>
                <Routes location={location} key={location.pathname}>
                    <Route
                        path="/"
                        element={
                            <AnimatedPage>
                                <LandingPage />
                            </AnimatedPage>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <AnimatedPage>
                                <AuthPage />
                            </AnimatedPage>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <AnimatedPage>
                                <AuthPage defaultTab="register" />
                            </AnimatedPage>
                        }
                    />
                    <Route
                        path="/submit"
                        element={
                            <ProtectedRoute allowedRoles={['citizen']}>
                                <AnimatedPage>
                                    <SubmitComplaint />
                                </AnimatedPage>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-complaints"
                        element={
                            <ProtectedRoute allowedRoles={['citizen']}>
                                <AnimatedPage>
                                    <MyComplaints />
                                </AnimatedPage>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/track"
                        element={
                            <AnimatedPage>
                                <TrackComplaint />
                            </AnimatedPage>
                        }
                    />
                    <Route
                        path="/admin/login"
                        element={
                            <AnimatedPage>
                                <AdminLogin />
                            </AnimatedPage>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <AdminRoute>
                                <AnimatedPage>
                                    <AdminDashboard />
                                </AnimatedPage>
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/analytics"
                        element={
                            <AdminRoute>
                                <AnimatedPage>
                                    <Analytics />
                                </AnimatedPage>
                            </AdminRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AnimatePresence>
        </>
    );
}
