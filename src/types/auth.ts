/**
 * 인증 관련 타입 정의
 */

// 사용자 정보
export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    createAt: string;
    updatedAt: string;
}

// 로그인 응답
export interface LoginResponse {
    token: string;
    user: User;
}

// 인증 상태
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
}

// 인증 컨텍스트 타입
export interface AuthContextType extends AuthState {
    login: () => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}
