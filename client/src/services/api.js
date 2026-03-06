import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://civicsense-backend-9r4a.onrender.com',
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginPage =
            window.location.pathname === '/login' ||
            window.location.pathname === '/admin/login' ||
            window.location.pathname === '/register';

        if (error.response?.status === 401 && !isLoginPage) {
            const user = (() => {
                try { return JSON.parse(localStorage.getItem('user')); }
                catch { return null; }
            })();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            const isAdmin = user?.role === 'admin' || user?.role === 'officer';
            window.location.href = isAdmin ? '/admin/login' : '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
