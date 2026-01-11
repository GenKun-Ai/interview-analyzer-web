/**
 * 인증 상태 관리 Context (쿠키 기반)
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import type { AuthContextType, User } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 앱 시작 시 인증 상태 확인
    useEffect(() => {
        checkAuth();
    }, []);

    // 인증 상태 확인 (GET /users/me)
    const checkAuth = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/users/me`, {
                withCredentials: true,
            });
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Google OAuth 로그인 시작
    const login = () => {
        window.location.href = `${API_BASE_URL}/users/google`;
    };

    // 로그아웃
    const logout = () => {
        setUser(null);
        // 백엔드 로그아웃 API가 있다면 여기서 호출
        // await axios.post(`${API_BASE_URL}/users/logout`, {}, { withCredentials: true });
    };

    const value: AuthContextType = {
        user,
        token: null, // 쿠키 기반이므로 프론트엔드에서 토큰 관리 안함
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
