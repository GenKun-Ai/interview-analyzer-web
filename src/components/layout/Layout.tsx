/**
 * LayOut = 전체 페이지 틀
 * Header + Main + Footer
 */

import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import classNames from 'classnames/bind';
import styles from './Layout.module.scss';

const cx = classNames.bind(styles);

export const Layout = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
      <div className={cx("layout")}>
        {/* Header: 상단 네비게이션 */}

        <header className={cx("header")}>
          <div className={cx("container")}>
            <a href="/" className={cx("logo")}>
              <img src="/assets/genkun.png" alt="Genkun" />
            </a>
            <nav>
              <a href="/">세션 목록</a>
              {isAuthenticated && user && (
                <div className={cx("user-menu")}>
                  <div className={cx("user-info")}>
                    <div className={cx("user-avatar")}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className={cx("user-name")}>{user.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className={cx("logout-btn")}
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </nav>
          </div>
        </header>

        {/* Main: 페이지 내용이 들어갈 자리 */}
        <main className={cx("main")}>
          <div className={cx("container")}>
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className={cx("footer")}>
          <div className={cx("container")}>
            <p>&copy; 2025 Genkun</p>
          </div>
        </footer>
      </div>
    );
};