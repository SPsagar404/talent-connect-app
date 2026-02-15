import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * Authentication context provider.
 * Manages JWT token, user info, and login/logout state.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load saved auth state on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (authResponse) => {
        setToken(authResponse.token);
        setUser({
            fullName: authResponse.fullName,
            email: authResponse.email,
            hasResume: authResponse.hasResume,
        });
        localStorage.setItem('token', authResponse.token);
        localStorage.setItem('user', JSON.stringify({
            fullName: authResponse.fullName,
            email: authResponse.email,
            hasResume: authResponse.hasResume,
        }));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateResumeStatus = (hasResume, resumeName) => {
        const updated = { ...user, hasResume, resumeName: resumeName || user?.resumeName };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, updateResumeStatus }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
