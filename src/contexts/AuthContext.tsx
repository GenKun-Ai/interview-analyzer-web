/**
 * 인증 상태 관리 Context (쿠키 기반)
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthContextType, User } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 앱 시작 시 인증 상태 확인
    useEffect(() => {
        checkAuth();
    }, []);

    // 쿠키의 JWT로 현재 유저 정보 조회
    const checkAuth = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/users/me`, {
                credentials: 'include', // 쿠키 포함
            });
            if (res.ok) {
                const userData: User = await res.json();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Google OAuth 로그인 시작 → 백엔드로 리다이렉트
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
