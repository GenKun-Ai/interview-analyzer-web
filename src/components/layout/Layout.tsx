/**
 * LayOut = 전체 페이지 틀
 * Header + Main + Footer
 */

import { Outlet } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Layout.module.scss';

const cx = classNames.bind(styles);

export const Layout = () => {
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