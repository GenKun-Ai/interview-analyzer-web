/**
 * useUpload hook
 * 파일 업로드 + 작업 상태 폴링
 */
import { useState, useCallback, useRef } from "react";
import type { JobStatusResponse } from "../types/session";
import * as api from '../services/api';

export const useUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [jobStatus, setJobStatus] = useState<JobStatusResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const pollingRef = useRef<number | null>(null);

    // 폴링 중지
    const stopPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    }, []);

    // 작업 상태 폴링 시작
    const startPolling = useCallback((sessionId: string) => {
        stopPolling();

        pollingRef.current = setInterval(async () => {
            try {
                const status = await api.getJobStatus(sessionId);
                setJobStatus(status);
                setProgress(status.progress);

                // 완료 또는 실패시 폴링 중지
                if (status.jobState === 'completed' || status.jobState === 'failed') {
                    stopPolling();
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('상태 조회 실패');
                }
                stopPolling();
            }
        }, 2000)
    }, [stopPolling]);

    // 파일 업로드
    const uploadFile = useCallback(async (sessionId: string, file: File) => {
        try {
            setUploading(true);
            setError(null);
            setProgress(0);

            const result = await api.uploadFile(sessionId, file);

            // 업로드 성공 -> 폴링 시작
            startPolling(sessionId);

            return result;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("업로드 실패");
            }
            throw err;
        } finally {
            setUploading(false);
        }
    }, [startPolling]);
    
    // 컴포넌트 언마운트시 클린업
    const cleanup = useCallback(() => {
        stopPolling();
    }, [stopPolling]);

    return {
      // 상태
        uploading,
        progress,
        jobStatus,
        error,
      // 액션
        uploadFile,
        stopPolling,
        cleanup,
    };
}