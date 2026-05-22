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
        transcript: {
            sessionId: 'mock-1',
            language: 'ko',
            duration: 183,
            fullText: '안녕하세요. 저는 백엔드 개발자를 지망하는 김민준입니다. 대학교에서 컴퓨터 공학을 전공하였고, 졸업 프로젝트로 음성 분석 시스템을 개발한 경험이 있습니다.',
            segments: [
                { id: 's1', text: '안녕하세요. 저는 백엔드 개발자를 지망하는 김민준입니다.', startTime: 0, endTime: 5.2, confidence: 0.97 },
                { id: 's2', text: '대학교에서 컴퓨터 공학을 전공하였고,', startTime: 5.5, endTime: 9.1, confidence: 0.95 },
                { id: 's3', text: '졸업 프로젝트로 음성 분석 시스템을 개발한 경험이 있습니다.', startTime: 9.4, endTime: 14.8, confidence: 0.93 },
                { id: 's4', text: '특히 NestJS와 PostgreSQL을 활용한 백엔드 설계에 강점이 있습니다.', startTime: 15.2, endTime: 21.0, confidence: 0.96 },
            ],
        },
        analysis: {
            sessionId: 'mock-1',
            overallScore: 82,
            engineUsed: 'gpt-4o',
            recommendations: [
                '답변 시작 시 잠깐의 침묵이 있었습니다. 자신감 있게 바로 시작해보세요.',
                '구체적인 수치나 성과를 포함하면 더 설득력이 높아집니다.',
                '말하기 속도가 약간 빠릅니다. 중요한 부분에서 속도를 늦춰보세요.',
            ],
            structuralAnalysis: {
                appropriatenessScore: 85,
                questionResponsePairs: [
                    {
                        question: { id: 'q1', text: '자기소개를 해주세요.', startTime: 0, endTime: 2, confidence: 1 },
                        response: { id: 'a1', text: '안녕하세요. 저는 백엔드 개발자를 지망하는 김민준입니다. 대학교에서 컴퓨터 공학을 전공하였습니다.', startTime: 2.5, endTime: 14.8, confidence: 0.95 },
                        questionIntent: '지원자의 배경과 역량 파악',
                        appropriateness: 0.85,
                        feedback: '직무와 관련된 경험을 명확하게 언급한 좋은 답변입니다. 구체적인 프로젝트 성과를 수치로 표현하면 더욱 효과적입니다.',
                    },
                ],
                keywordMatches: [
                    { keyword: '백엔드', count: 2, segments: [0, 3], relevance: 0.9 },
                    { keyword: '개발', count: 3, segments: [0, 2, 3], relevance: 0.85 },
                    { keyword: 'NestJS', count: 1, segments: [3], relevance: 0.95 },
                ],
            },
            speechHabits: {
                speakingRate: 142,
                averagePauseDuration: 0.8,
                silenceDurations: [{ startTime: 4.8, endTime: 5.5, duration: 0.7 }],
                fillerWords: [{ word: '음', count: 2, timestamps: [8.2, 13.1] }],
            },
        },
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
        transcript: {
            sessionId: 'mock-2',
            language: 'ja',
            duration: 240,
            fullText: '御社を志望した理由は、AIと音声技術を組み合わせた革新的なサービスに魅力を感じたからです。私はバックエンド開発の経験を活かし、御社のプロダクト成長に貢献したいと考えています。',
            segments: [
                { id: 'j1', text: '御社を志望した理由は、AIと音声技術を組み合わせた革新的なサービスに魅力を感じたからです。', startTime: 0, endTime: 8.5, confidence: 0.94 },
                { id: 'j2', text: '私はバックエンド開発の経験を活かし、', startTime: 9.0, endTime: 13.2, confidence: 0.96 },
                { id: 'j3', text: '御社のプロダクト成長に貢献したいと考えています。', startTime: 13.5, endTime: 18.0, confidence: 0.95 },
            ],
        },
        analysis: {
            sessionId: 'mock-2',
            overallScore: 78,
            engineUsed: 'gpt-4o',
            recommendations: [
                '敬語の使い方は正確です。より具体的なエピソードを加えると説得力が増します。',
                '話すスピードが少し速いです。重要な部分でゆっくり話してみてください。',
            ],
            structuralAnalysis: {
                appropriatenessScore: 80,
                questionResponsePairs: [
                    {
                        question: { id: 'jq1', text: '志望動機を教えてください。', startTime: 0, endTime: 2, confidence: 1 },
                        response: { id: 'ja1', text: '御社を志望した理由は、AIと音声技術を組み合わせた革新的なサービスに魅力を感じたからです。', startTime: 2.5, endTime: 18.0, confidence: 0.95 },
                        questionIntent: '応募者の志望意欲の確認',
                        appropriateness: 0.80,
                        feedback: '企業の特徴に言及した志望動機は好印象です。自身の経験と企業のニーズを結びつけた表現ができるとさらに良くなります。',
                    },
                ],
                keywordMatches: [
                    { keyword: 'AI', count: 1, segments: [0], relevance: 0.9 },
                    { keyword: 'バックエンド', count: 1, segments: [1], relevance: 0.85 },
                ],
            },
            speechHabits: {
                speakingRate: 138,
                averagePauseDuration: 1.0,
                silenceDurations: [{ startTime: 8.5, endTime: 9.0, duration: 0.5 }],
                fillerWords: [],
            },
        },
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
        if (isGuest) {
            // sessions 상태에서 먼저 찾고, 없으면 MOCK_SESSIONS에서 탐색
            const found = MOCK_SESSIONS.find((s) => s.id === id)
                ?? { id, language: 'ko', status: 'CREATED' as const, description: '새 세션', originalAudioPath: '', audioDuration: 0, deleteAfterAnalysis: false, createAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
            setCurrentSession(found);
            return;
        }
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
    }, [isGuest]);

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
        if (isGuest) {
            setSessions((prev) => prev.filter((s) => s.id !== id));
            return;
        }
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
    }, [isGuest]);

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