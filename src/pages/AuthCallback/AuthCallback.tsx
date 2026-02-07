/**
 * OAuth Callback Page
 * - Google OAuth 리다이렉트 처리
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const AuthCallback = () => {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            await checkAuth();
            navigate('/', { replace: true });
        };

        handleCallback();
    }, [checkAuth, navigate]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            fontSize: '1.2rem',
            color: '#333'
        }}>
            로그인 처리 중...
        </div>
    );
};
