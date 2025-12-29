/**
 * API Service Layer
 */

import axios, { type AxiosInstance } from 'axios';
import type {
    Session,
    SessionListResponse,
    SessionDetailResponse,
    CreateSessionRequest,
    UploadResponse,
    JobStatusResponse,
    ApiError
} from '../types/session';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30초
    headers: {
        'Content-Type': 'application/json'
    },
});

// 응답 인터셉터 (예외 처리)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const apiError: ApiError = {
            message: error.response?.data?.message || error.message,
            statusCode: error.response?.status || 500,
            error: error.response?.data?.error,
        };
        return Promise.reject(apiError);
    }
)

/**
 * 세션 생성
 * POST /session
 */
export const createSession = async (data?: CreateSessionRequest): Promise<Session> => {
  const response = await apiClient.post<Session>("/session", data);
  return response.data;
};

/**
 * 세션 목록 조회
 * GET /session
 */
export const getSessionList = async (): Promise<SessionListResponse> => {
    const response = await apiClient.get<SessionListResponse>('/session');
    return response.data;
}

/**
 * 세션 상태 조회
 * GET /session/:id
 */
export const getSession = async (id: string): Promise<SessionDetailResponse> => {
    const response = await apiClient.get<SessionDetailResponse>(`/session/${id}`);
    return response.data;
}

/**
 * 세션 상태 삭제
 * DELETE /session/:id
 */
export const deleteSession = async (id: string): Promise<void> => {
    await apiClient.delete(`/session/${id}`);
};

/**
 * 음성 파일 업로드(비동기)
 * POST /session/:id/upload
 */
export const uploadFile = async (
    id: string,
    file: File
): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('audio', file);

    const response = await apiClient.post<UploadResponse>(
        `/session/${id}/upload`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            timeout: 60000, // 업로드 1분
        }
    );
    return response.data;
};

/**
 * 작업 상태 조회
 * GET /session/:id/job-status
 */
export const getJobStatus = async (id: string): Promise<JobStatusResponse> => {
    const response = await apiClient.get<JobStatusResponse>(
        `/session/${id}/job-status`
    );
    return response.data;
};

/**
 * 오디오 스트리밍 URL 생성
 * GET /session/:id/audio
 */

export const getAudioUrl = (id: string): string => {
    return `${API_BASE_URL}/session/${id}/audio`;
};

export { apiClient };