import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

// redirectTo: where to send unauthenticated users
// requiredRole: "admin" | "officer" | "citizen" | null (any role)
const ProtectedRoute = ({ children, redirectTo = "/login", requiredRole = null }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) return <Navigate to={redirectTo} replace />;

    if (requiredRole && user?.role !== requiredRole) {
        if (user?.role === "admin" || user?.role === "officer") {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/submit" replace />;
    }

    return children;
};

export default ProtectedRoute;
