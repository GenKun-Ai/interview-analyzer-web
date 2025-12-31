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

// Transcript 관련 타입 (STT 결과)

export interface Word {
    text: string;
    startTime: number;
    endTime: number;
    confidence: number;
}

export interface TranscriptSegment {
    id: string;
    text: string;
    startTime: number;
    endTime: number;
    speakerId?: string;
    confidence: number;
    words?: Word[];
}

export interface Speaker {
    id: string;
    label: string;
}

export interface Transcript {
    sessionId: string;
    segments: TranscriptSegment[];
    speakers?: Speaker[];
    language: string;
    duration: number;
    fullText: string;
}

// Analysis 관련 타입 (분석 결과)
export interface QuestionResponsePair {
    question: TranscriptSegment;
    response: TranscriptSegment;
    questionIntent: string;
    appropriateness: number;
    feedback: string;
}

export interface StructuralAnalysis {
    questionResponsePairs: QuestionResponsePair[];
    appropriatenessScore: number;
    keywordMatches: string[]; 
}

export interface SilencePeriod {
    startTime: number;
    endTime: number;
    duration: number;
}

export interface FillerWordOccurrence {
    word: string;
    count: number;
    timestamps: number[];
}

export interface SpeechHabits {
    silenceDurations: SilencePeriod[];
    fillerWords: FillerWordOccurrence[];
    speakingRate: number;
    averagePauseDuration: number;
}

export interface Analysis {
    sessionId: string;
    structuralAnalysis: StructuralAnalysis;
    speechHabits: SpeechHabits;
    overallScore: number;
    recommendations: string[];
    engineUsed: string;
}

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
    transcript?: Transcript;
    analysis?: Analysis;
    createAt: string;
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

