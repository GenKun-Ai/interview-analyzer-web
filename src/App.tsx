import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home/Home";
import { SessionDetail } from "./pages/SessionDetail/SessionDetail";
import "./App.css";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout을 감싸는 라우트 */}
        <Route path="/" element={<Layout />}>
          {/* 홈 페이지 */}
          <Route index element={<Home />} />

          {/* 세션 상세 페이지 (추후 추가) */}
          <Route path="session/:id" element={<SessionDetail />} /> 
          
          {/* 404 - 존재하지 않는 경로 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
