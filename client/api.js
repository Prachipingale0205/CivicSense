import axios from 'axios';

// ── Base URL ──────────────────────────────────────────────────
// VITE_API_URL must be set in .env:
//   VITE_API_URL=https://civicsense-backend-9r4a.onrender.com
// Hardcoded fallback ensures the app works even if .env fails to load.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://civicsense-backend-9r4a.onrender.com',
    timeout: 15000, // 15s — covers Render free-tier cold starts (can take up to 50s on first wake)
    headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor ───────────────────────────────────────
// Attaches JWT token to every outgoing request automatically.
// Token is stored in localStorage after login.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────
// On 401 Unauthorized:
//   - Clears token + user from localStorage
//   - Redirects to correct login page based on user role
//     (admins/officers → /admin/login, citizens → /login)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Read role before clearing storage
            const user = (() => {
                try { return JSON.parse(localStorage.getItem('user')); }
                catch { return null; }
            })();

            // Clear session
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Role-aware redirect
            const isAdmin = user?.role === 'admin' || user?.role === 'officer';
            window.location.href = isAdmin ? '/admin/login' : '/login';
        }
        return Promise.reject(error);
    }
);

export default api;