# GenKun Frontend

> AI 음성 분석 시스템 프론트엔드 웹 애플리케이션

React + TypeScript 기반의 SPA로, 오디오 파일 업로드, 실시간 진행 상황 추적, 음성 분석 결과 시각화 기능을 제공합니다.

**📌 [전체 프로젝트 보기](https://github.com/ias-kim/genkun-platform)**

---

## 🛠 기술 스택

### Core
- **React** 18.3.1 - UI 라이브러리
- **TypeScript** 5.6.2 - 프로그래밍 언어
- **Vite** 6.0.5 - 빌드 도구

### Routing & State
- **React Router DOM** 7.1.1 - SPA 라우팅
- **Custom Hooks** - 상태 관리 및 로직 분리

### Styling
- **SCSS** - CSS 전처리기
- **CSS Modules** - 스타일 캡슐화
- **classnames** 2.5.1 - 동적 클래스 관리

### HTTP Client
- **Axios** 1.7.9 - RESTful API 통신

---

## 🔥 주요 기능

### 1. 실시간 작업 진행 추적
- 폴링 방식으로 백엔드 작업 상태 실시간 조회
- 진행률 바 및 상태별 시각적 피드백

### 2. Drag & Drop 파일 업로드
- HTML5 Drag & Drop API 활용
- 파일 검증 및 업로드 진행률 표시

### 3. 오디오-자막 실시간 동기화
- HTML5 Audio API로 재생 제어
- timeupdate 이벤트 기반 자막 활성화
- 자막 클릭 시 해당 시간으로 이동

### 4. 반응형 디자인
- Desktop/Tablet/Mobile 완전 대응
- Grid 기반 카드 레이아웃

---

## 📂 프로젝트 구조

```
src/
├── components/
│   └── layout/
│       ├── Layout.tsx              # 메인 레이아웃
│       └── Layout.module.scss
├── pages/
│   ├── Home/
│   │   ├── Home.tsx                # 세션 목록 페이지
│   │   └── Home.module.scss
│   └── SessionDetail/
│       ├── SessionDetail.tsx       # 세션 상세 (업로드, 재생, 분석)
│       └── SessionDetail.module.scss
├── hooks/
│   ├── useSession.ts               # 세션 관리 커스텀 훅
│   └── useUpload.ts                # 파일 업로드 커스텀 훅
├── services/
│   └── api.ts                      # Axios 인스턴스 및 API 함수
├── scss/
│   └── global.scss                 # 전역 CSS 변수
├── App.tsx                         # 라우팅 설정
└── main.tsx                        # 애플리케이션 엔트리
```

---

## 🚀 빠른 시작

### 사전 요구사항
- Node.js 18.x 이상
- npm 또는 yarn
- 백엔드 API 서버 실행 중

### 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일에서 VITE_API_URL 설정

# 3. 개발 서버 실행
npm run dev
```

개발 서버: `http://localhost:5173`

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

## 🖥 주요 페이지

### 세션 목록 (`/`)
- 세션 카드형 레이아웃
- 상태별 색상 구분 (대기/완료/실패)
- 세션 생성 버튼 (한국어/일본어)

### 세션 상세 (`/session/:id`)
- 세션 정보 표시
- 파일 업로드 (Drag & Drop)
- 작업 진행 상황 실시간 추적
- 오디오 재생 및 자막 동기화
- AI 분석 결과 시각화

---

## 🏗 핵심 기술

### Custom Hooks Pattern
```
useSession
├── fetchSession (세션 조회)
├── fetchSessions (목록 조회)
├── createSession (생성)
└── deleteSession (삭제)

useUpload
├── uploadFile (파일 업로드)
├── pollJobStatus (작업 상태 폴링)
└── cleanup (정리)
```

### 실시간 동기화 구현
```
Audio timeupdate 이벤트
    ↓
currentTime 상태 업데이트
    ↓
자막 세그먼트 매칭
    ↓
활성 자막 하이라이트 + 자동 스크롤
```

---

## 📝 환경 변수

```env
# API 서버
VITE_API_URL=http://localhost:5000/api
```

---

## 📊 성능 최적화

- ✅ useRef로 불필요한 리렌더 방지
- ✅ 이벤트 리스너 Cleanup으로 메모리 누수 방지
- ✅ CSS Modules로 스타일 충돌 방지
- ✅ Vite 기반 빠른 HMR

---

## 🎨 디자인

- 민트/틸 계열 색상 테마 (로고와 통일)
- Desktop/Tablet/Mobile 완전 반응형 대응

---

## 📚 참고 자료

- [React 공식 문서](https://react.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [Vite 공식 문서](https://vitejs.dev/)
- [React Router 공식 문서](https://reactrouter.com/)

---

## 👤 개발자

**Gwankwon An**
- GitHub: [@ias-kim](https://github.com/ias-kim)

---

**📌 전체 프로젝트 (Backend 포함) 보기:**
https://github.com/ias-kim/genkun-platform
