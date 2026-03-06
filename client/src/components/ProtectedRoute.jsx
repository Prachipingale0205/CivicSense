import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

// redirectTo: where to send unauthenticated users
// allowedRoles: array of roles allowed, e.g. ["admin", "officer"]
const ProtectedRoute = ({ children, redirectTo = "/login", requiredRole = null, allowedRoles = null }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) return <Navigate to={redirectTo} replace />;

    // Backward compatibility for single requiredRole string
    const rolesToCheck = allowedRoles || (requiredRole ? [requiredRole] : null);

    if (rolesToCheck && !rolesToCheck.includes(user?.role)) {
        if (user?.role === "admin" || user?.role === "officer") {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/submit" replace />;
    }

    return children;
};

export default ProtectedRoute;
