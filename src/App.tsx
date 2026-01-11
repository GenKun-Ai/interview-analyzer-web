import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home/Home";
import { SessionDetail } from "./pages/SessionDetail/SessionDetail";
import { Login } from "./pages/Login/Login";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 로그인 페이지 */}
          <Route path="/login" element={<Login />} />

          {/* Layout을 감싸는 라우트 (인증 필요) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* 홈 페이지 */}
            <Route index element={<Home />} />

            {/* 세션 상세 페이지 */}
            <Route path="session/:id" element={<SessionDetail />} />

            {/* 404 - 존재하지 않는 경로 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
