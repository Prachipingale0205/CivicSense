import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            // Validate session with backend
            api.get('/api/auth/me')
                .then((res) => {
                    setUser(res.data.user || res.data);
                    localStorage.setItem('user', JSON.stringify(res.data.user || res.data));
                })
                .catch(() => {
                    // Token invalid — clear session
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (tkn, usr) => {
        setToken(tkn);
        setUser(usr);
        localStorage.setItem('token', tkn);
        localStorage.setItem('user', JSON.stringify(usr));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const isAdmin = () => user?.role === 'admin' || user?.role === 'officer';

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
