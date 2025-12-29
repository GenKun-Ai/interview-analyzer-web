/**
 * API 스펙에 맞춘 타입 정의
 */

// 세션 상태
export type SessionStatus = 
    | 'CREATED'
    | 'QUEUED'
    | 'TRANSCRIBING'
    | 'ANALYZING'
    | 'COMPLETED'
    | 'FAILED';

// 작업 상태
export type JobState = 'active' | 'completed' | 'failed' | 'delayed' | 'waiting';

// 세션 기본 정보
export interface Session {
    id: string;
    language: string;
    status: SessionStatus;
    description: string;
    originalAudioPath: string;
    audioDuration: number;
    deleteAfterAnalysis: boolean;
    errorMessage?: string;
    transcript: Record<string, any>;
    analysis: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

// 세션 목록 응답 (GET /session)
export type SessionListResponse = Session[];

// 세션 상태 응답 (GET /session/:id)
export type SessionDetailResponse = Session;

// 세션 생성 요청 (POST /session)
export interface CreateSessionRequest {
  language?: string;
  description?: string;
}

// 파일 업로드 응답 (POST /session/:id/upload)
export interface UploadResponse {
    message: string;
    sessionId: string;
    jobId: string;
    status: SessionStatus;
}

// 작업 상태 응답 (GET /session/:id/job-status)
export interface JobStatusResponse {
    sessionId: string;
    status: SessionStatus;
    progress: number;
    jobId: string;
    jobState: JobState;
}

// API 에러 응답
export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}

