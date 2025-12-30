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

export const SessionDetail = () => {
  const { id } = useParams<{ id: string }>(); // URL 파라미터

  const navigate = useNavigate();
  const { currentSession, loading, error, fetchSession, deleteSession } =
    useSession();
  const { uploading, progress, jobStatus, uploadFile, cleanup } = useUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  if (loading) return <div className={cx("loading")}>로딩중...</div>;
  if (error) return <div className={cx("error")}>{error}</div>;
  if (!currentSession)
    return <div className={cx("error")}>세션을 찾을 수 없습니다.</div>;

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
        <p>상태: {currentSession.status}</p>
        <p>언어: {currentSession.language}</p>
        <p>길이: {currentSession.audioDuration}</p>
      </div>

      {/* 파일 업로드 */}
      {currentSession.status === "CREATED" && (
        <div className={cx("upload-card")}>
          <h3>음성 파일 업로드</h3>
          <input type="file" accept="audio/*" onChange={handleFileChange} />
          {selectedFile && (
            <div>
              <p>선택된 파일: {selectedFile.name}</p>
              <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "업로드 중..." : "업로드"}
              </button>
            </div>
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
        <div className={cx("status-card")}>
          <h3>작업 상태</h3>
          <p>상태: {jobStatus.status}</p>
          <p>진행률: {jobStatus.progress}%</p>
          <p>작업 상태: {jobStatus.jobState}</p>
        </div>
      )}

      {/* 오디오 플레이어 */}
      {currentSession.status === "COMPLETED" && (
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
      )}

      {/* 자막 (Transcript) */}
      {currentSession.status === 'COMPLETED' && currentSession.transcript && (
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