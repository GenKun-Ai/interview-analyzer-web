/**
 * SessionDetail Page
 * - 세션 상세 정보
 * - 파일 업로드
 * - 오디오 재생
 * - 작업 상태 표시
 * - 자막 동기화
 */

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSession } from "../../hooks/useSession";
import { useUpload } from "../../hooks/useUpload";
import { getAudioUrl } from "../../services/api";
import classNames from "classnames/bind";
import styles from './SessionDetail.module.scss';

const cx = classNames.bind(styles);

// 상태 한글 변환
const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'CREATED': '대기중',
    'UPLOADING': '업로드중',
    'PROCESSING': '처리중',
    'TRANSCRIBING': '음성 인식 중',
    'ANALYZING': '분석 중',
    'COMPLETED': '완료',
    'FAILED': '실패'
  };
  return statusMap[status] || status;
};

// 작업 상태 한글 변환
const getJobStateText = (state: string) => {
  const stateMap: { [key: string]: string } = {
    'active': '진행 중',
    'completed': '완료',
    'failed': '실패',
    'waiting': '대기 중',
    'delayed': '지연됨',
    'paused': '일시 정지'
  };
  return stateMap[state] || state;
};

// 언어 한글 변환
const getLanguageText = (lang: string) => {
  const langMap: { [key: string]: string } = {
    'ko': '한국어',
    'ja': '일본어'
  };
  return langMap[lang] || lang;
};

export const SessionDetail = () => {
  const { id } = useParams<{ id: string }>(); // URL 파라미터

  const navigate = useNavigate();
  const { currentSession, loading, error, fetchSession, deleteSession } =
    useSession();
  const { uploading, progress, jobStatus, uploadFile, cleanup } = useUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const segmentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [playbackRate, setPlaybackRate] = useState(1); // 재생 속도

  // 세션 로드
  useEffect(() => {
    if (id) {
      fetchSession(id);
    } else {
      navigate("/");
    }
  }, [id, fetchSession, navigate]);

  // CleanUp
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  // 오디오 재생 시간 추적
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return (() => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
    });
  }, []);

  // 현재 시간에 맞는 자막 찾기
  useEffect(() => {
    if (!currentSession?.transcript?.segments) return;

    const activeSegment = currentSession.transcript.segments.find(
        (segment) => currentTime >= segment.startTime && currentTime <= segment.endTime
    );

    if (activeSegment) {
        setActiveSegmentId(activeSegment.id);
        
        // 자동 스크롤
        const segmentElement = segmentRefs.current[activeSegment.id];
        if (segmentElement) {
            segmentElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
  }, [currentTime, currentSession]);

  // 파일 선택
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 파일 업로드
  const handleUpload = async () => {
    if (!id || !selectedFile) return;

    try {
      await uploadFile(id, selectedFile);
      setSelectedFile(null);
      await fetchSession(id);
    } catch (err) {
      console.error("업로드 실패", err);
    }
  };

  // 세션 삭제
  const handleDelete = async () => {
    if (!id || !confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteSession(id);
      navigate("/");
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  // 시간 포맷 함수 (초 -> mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 자막 클릭 시 해당 시간으로 이동
  const handleSegmentClick = (startTime: number) => {
    if (audioRef.current) {
        audioRef.current.currentTime = startTime;
    }
  }

  // 재생 속도 변경
  const handlePlaybackRateChange = (rate: number) => {
    if (audioRef.current) {
        audioRef.current.playbackRate = rate;
        setPlaybackRate(rate);
    }
  }

  // 드래그 이벤트 핸들러
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // 드롭 이벤트 핸들러
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  if (loading) return <div className={cx("loading")}>로딩중...</div>;
  if (error) return (
    <div className={cx("error-container")}>
      <div className={cx("error-icon")}>⚠️</div>
      <h3>오류가 발생했습니다</h3>
      <p className={cx("error-message")}>{error}</p>
      <button onClick={() => id && fetchSession(id)} className={cx("retry-btn")}>
        다시 시도
      </button>
    </div>
  );
  if (!currentSession)
    return (
      <div className={cx("error-container")}>
        <div className={cx("error-icon")}>❌</div>
        <h3>세션을 찾을 수 없습니다</h3>
        <button onClick={() => navigate("/")} className={cx("retry-btn")}>
          목록으로 돌아가기
        </button>
      </div>
    );

  return (
    <div className={cx("session-detail")}>
      {/* 헤더 */}
      <div className={cx("header")}>
        <h2>{currentSession.description}</h2>
        <button onClick={handleDelete} className={cx("delete-btn")}>
          삭제
        </button>
      </div>

      {/* 세션 정보 */}
      <div className={cx("info-card")}>
        <h3>세션 정보</h3>
        <div className={cx("info-row")}>
          <span className={cx("label")}>상태:</span>
          <span className={cx("status-badge", currentSession.status.toLowerCase())}>
            {getStatusText(currentSession.status)}
          </span>
        </div>
        <div className={cx("info-row")}>
          <span className={cx("label")}>언어:</span>
          <span>{getLanguageText(currentSession.language)}</span>
        </div>
        {currentSession.audioDuration && (
          <div className={cx("info-row")}>
            <span className={cx("label")}>길이:</span>
            <span>{currentSession.audioDuration}</span>
          </div>
        )}
      </div>

      {/* 실패 메시지 */}
      {currentSession.status === "FAILED" && (
        <div className={cx("error-card")}>
          <div className={cx("error-header")}>
            <span className={cx("error-icon")}>⚠️</span>
            <h3>작업 실패</h3>
          </div>
          <p className={cx("error-description")}>
            {(currentSession as any).errorMessage ||
             (currentSession as any).error ||
             "음성 파일 처리 중 오류가 발생했습니다. 파일 형식이나 품질을 확인해주세요."}
          </p>
          <div className={cx("error-actions")}>
            <button
              onClick={() => window.location.reload()}
              className={cx("retry-btn")}
            >
              다시 시도
            </button>
            <button
              onClick={() => navigate("/")}
              className={cx("back-btn")}
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      )}

      {/* 파일 업로드 */}
      {currentSession.status === "CREATED" && (
        <div className={cx("upload-card")}>
          <h3>음성 파일 업로드</h3>
          <div
            className={cx("upload-zone", { active: dragActive })}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={cx("upload-icon")}>📁</div>
            <p className={cx("upload-text")}>
              {selectedFile
                ? `선택된 파일: ${selectedFile.name}`
                : "파일을 드래그하거나 클릭하여 선택하세요"
              }
            </p>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className={cx("file-input")}
            />
          </div>
          {selectedFile && (
            <button onClick={handleUpload} disabled={uploading} className={cx("upload-btn")}>
              {uploading ? "업로드 중..." : "업로드 시작"}
            </button>
          )}
        </div>
      )}

      {/* 업로드 진행률 */}
      {uploading && (
        <div className={cx("progress-card")}>
          <h3>업로드 진행중</h3>
          <progress value={progress} max={100} />
          <p>{progress}%</p>
        </div>
      )}

      {/* 작업 상태 */}
      {jobStatus && (
        <div className={cx("status-card", jobStatus.jobState)}>
          <div className={cx("status-header")}>
            <h3>작업 진행 상황</h3>
            <span className={cx("status-badge", jobStatus.jobState)}>
              {getJobStateText(jobStatus.jobState)}
            </span>
          </div>

          <div className={cx("status-info")}>
            <p className={cx("status-text")}>{getStatusText(jobStatus.status)}</p>
          </div>

          {/* 진행률 바 */}
          <div className={cx("progress-bar-container")}>
            <div className={cx("progress-bar")}>
              <div
                className={cx("progress-fill", jobStatus.jobState)}
                style={{ width: `${jobStatus.progress}%` }}
              />
            </div>
            <span className={cx("progress-text")}>{jobStatus.progress}%</span>
          </div>
        </div>
      )}

      {/* 오디오 + 자막 (좌우 배치) */}
      {currentSession.status === "COMPLETED" && (
        <div className={cx("media-container")}>
          {/* 자막 (왼쪽) */}
          {currentSession.transcript && (
            <div className={cx('transcript-card')}>
              <h3>자막</h3>
              <div className={cx('transcript-list')}>
                {currentSession.transcript.segments.map((segment) => (
                  <div
                    key={segment.id}
                    ref={(el) => {segmentRefs.current[segment.id] = el; }}
                    className={cx('transcript-segment', {
                      active: activeSegmentId === segment.id
                    })}
                    onClick={() => handleSegmentClick(segment.startTime)}
                  >
                    <span className={cx('time')}>
                      {formatTime(segment.startTime)}
                    </span>
                    <span className={cx('text')}>{segment.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 오디오 재생 (오른쪽) */}
          <div className={cx("audio-card")}>
            <h3>오디오 재생</h3>
            <audio
              ref={audioRef}
              controls
              src={getAudioUrl(currentSession.id)}
            />

            {/* 재생 속도 조절 */}
            <div className={cx("playback-controls")}>
              <span className={cx("label")}>재생 속도:</span>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  className={cx("rate-btn", { active: playbackRate === rate })}
                  onClick={() => handlePlaybackRateChange(rate)}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 분석 결과 */}
      {currentSession.analysis && (
        <div className={cx("analysis-card")}>
          <h3>분석 결과</h3>
          <p>총점: {currentSession.analysis.overallScore}</p>
          <h4>추천사항 :</h4>
          <ul>
            {currentSession.analysis.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
          <h4>키워드 매치</h4>
          <ul>
            {currentSession.analysis.structuralAnalysis.keywordMatches.map((keyword, idx) => (
                <li key={idx}>{keyword}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}