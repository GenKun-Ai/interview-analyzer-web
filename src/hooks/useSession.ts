/**
 * useSession Hook
 * 세션 CRUD 로직
 */

import { useCallback, useState } from "react";
import type { CreateSessionRequest, Session } from "../types/session";
import * as api from '../services/api';

export const useSession = () => {
    // 상태관리
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 세션 목록 조회
    const fetchSessions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getSessionList();
            setSessions(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('알 수 없는 에러');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // 세션 상세 조회
    const fetchSession = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getSession(id);
            setCurrentSession(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('알 수 없는 에러');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // 세션 생성
    const createSession = useCallback(async (req?: CreateSessionRequest) => {
        try {
            setLoading(true);
            setError(null);
            const newSession = await api.createSession(req);
            setSessions((prev) => [newSession, ...prev]);
            return newSession;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('알 수 없는 에러');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // 세션 삭제
    const deleteSession = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await api.deleteSession(id);
            setSessions((prev) => prev.filter((s) => s.id !== id));
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('알 수 없는 에러');
            }
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