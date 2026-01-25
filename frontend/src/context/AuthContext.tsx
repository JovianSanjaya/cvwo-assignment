import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getToken, setToken, removeToken, apiFetch } from '../services/api';

interface User {
    id: number;
    username: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (token) {
            apiFetch('/auth/me')
                .then(res => res.ok ? res.json() : Promise.reject())
                .then(data => setUser({ id: data.id, username: data.username }))
                .catch(() => {
                    removeToken();
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    function login(token: string) {
        setToken(token);
        apiFetch('/auth/me')
            .then(res => res.json())
            .then(data => setUser({ id: data.id, username: data.username }));
    }

    function logout() {
        removeToken();
        setUser(null);
        window.location.href = '/';
    }

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
