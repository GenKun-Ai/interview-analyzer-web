/**
 * Home page
 * - 세션 목록 표시
 * - 새 세션 생성
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from '../../hooks/useSession';
import classNames from "classnames/bind";
import styles from './Home.module.scss';

const cx = classNames.bind(styles);

export const Home = () => {
    const navigate = useNavigate();
    const { sessions, loading, error, fetchSessions, createSession } = useSession();

    // 컴포넌트 마운트 시 세션 목록 로드
    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    // 새 세션 생성
    const handleCreateSession = async (language: string) => {
        try {
            const newSession = await createSession({
                description: '새 세션',
                language,
            });
            // 생성된 세션 상세 페이지로 이동
            navigate(`/session/${newSession.id}`);
        } catch (err) {
            console.error('세션 생성 실패: ', err)
        }
    };

    return (
        <div className={cx('home')}>
            <div className={cx('header')}>
                <h2>세션 목록</h2>
                <div className={cx('create-buttons')}>
                    <button onClick={() => handleCreateSession('ko')} disabled={loading}>
                        + 새 세션 (한국어)
                    </button>
                    <button onClick={() => handleCreateSession('ja')} disabled={loading}>
                        + 새 세션 (日本語)
                    </button>
                </div>
            </div>

            {/* 에러 표시 */}
            {error && <div className={cx('error')}>{error}</div>}

            {/* 로딩 표시 */}
            {loading && <div className={cx('loading')}>로딩중...</div>}

            {/* 세션 목록 */}
            {!loading && sessions.length === 0 && (
                <div className={cx('empty')}>세션이 없습니다</div>
            )}

            <div className={cx('sessions')}>
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className={cx('session-item')}
                        data-status={session.status}
                        onClick={() => navigate(`/session/${session.id}`)}
                    >
                        <h3>
                            {session.description || '세션'}
                            <span className={cx('status-badge', session.status.toLowerCase())}>
                                {session.status}
                            </span>
                        </h3>
                        <ul className={cx('info-list')}>
                            <li>
                                <strong>언어:</strong>
                                <span>{session.language === 'ko' ? '한국어' : '日本語'}</span>
                            </li>
                            <li>
                                <strong>생성:</strong>
                                <span>{session.createAt
                                    ? new Date(session.createAt).toLocaleString('ko-KR')
                                    : '-'
                                }</span>
                            </li>
                            {session.audioDuration && (
                                <li>
                                    <strong>길이:</strong>
                                    <span>{session.audioDuration}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};