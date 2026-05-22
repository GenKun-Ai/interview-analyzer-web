/**
 * useSession Hook
 * 세션 CRUD 로직
 */

import { useCallback, useState } from "react";
import type { CreateSessionRequest, Session } from "../types/session";
import type { ApiError } from "../types/session";
import { useAuth } from "../contexts/AuthContext";
import * as api from '../services/api';

const MOCK_SESSIONS: Session[] = [
    {
        id: 'mock-1',
        language: 'ko',
        status: 'COMPLETED',
        description: '한국어 면접 연습 - 자기소개',
        originalAudioPath: '',
        audioDuration: 183,
        deleteAfterAnalysis: false,
        createAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
        id: 'mock-2',
        language: 'ja',
        status: 'COMPLETED',
        description: '日本語面接練習 - 志望動機',
        originalAudioPath: '',
        audioDuration: 240,
        deleteAfterAnalysis: false,
        createAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
        id: 'mock-3',
        language: 'ko',
        status: 'ANALYZING',
        description: '한국어 면접 연습 - 직무 역량',
        originalAudioPath: '',
        audioDuration: 312,
        deleteAfterAnalysis: false,
        createAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
];

const extractErrorMessage = (err: unknown): string => {
    if (err instanceof Error) return err.message;
    if (err && typeof err === 'object' && 'message' in err) return String((err as ApiError).message);
    return '알 수 없는 에러';
};

export const useSession = () => {
    const { user } = useAuth();
    const isGuest = user?.id === 'guest';

    // 상태관리
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 세션 목록 조회
    const fetchSessions = useCallback(async () => {
        if (isGuest) {
            setSessions(MOCK_SESSIONS);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const data = await api.getSessionList();
            setSessions(data);
        } catch (err: unknown) {
            setError(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [isGuest]);

    // 세션 상세 조회
    const fetchSession = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getSession(id);
            setCurrentSession(data);
        } catch (err: unknown) {
            setError(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);

    // 세션 생성
    const createSession = useCallback(async (req?: CreateSessionRequest) => {
        if (isGuest) {
            const mockNew: Session = {
                id: `mock-${Date.now()}`,
                language: req?.language ?? 'ko',
                status: 'CREATED',
                description: req?.description ?? '새 세션',
                originalAudioPath: '',
                audioDuration: 0,
                deleteAfterAnalysis: false,
                createAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setSessions((prev) => [mockNew, ...prev]);
            return mockNew;
        }
        try {
            setLoading(true);
            setError(null);
            const newSession = await api.createSession(req);
            setSessions((prev) => [newSession, ...prev]);
            return newSession;
        } catch (err: unknown) {
            setError(extractErrorMessage(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, [isGuest]);

    // 세션 삭제
    const deleteSession = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await api.deleteSession(id);
            setSessions((prev) => prev.filter((s) => s.id !== id));
        } catch (err: unknown) {
            setError(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        // 상태
        sessions,
        currentSession,
        loading,
        error,
        // 액션
        fetchSession,
        fetchSessions,
        createSession,
        deleteSession,
    }
}