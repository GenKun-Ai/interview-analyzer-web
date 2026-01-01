# 言君(GenKun) フロントエンド

> AI音声分析システム フロントエンドウェブアプリケーション

React + TypeScriptベースのSPAで、オーディオファイルのアップロード、リアルタイムの進捗追跡、音声分析結果の視覚化機能を提供します。

このプロジェクトのREDMEは日本語と韓国語で提供いたします。
<br />
이 프로젝트의 README는 한국어와 일본어로 제공됩니다.

- [日本語 (Japanese)](README.md)
- [한국어 (Korean)](README.ko.md)

<br />

**📌 [プロジェクト全体を見る](https://github.com/ias-kim/genkun)**

---

## 🛠 技術スタック

### コア
- **React** 18.3.1 - UIライブラリ
- **TypeScript** 5.6.2 - プログラミング言語
- **Vite** 6.0.5 - ビルドツール

### ルーティング & 状態管理
- **React Router DOM** 7.1.1 - SPAルーティング
- **Custom Hooks** - 状態管理とロジックの分離

### スタイリング
- **SCSS** - CSSプリプロセッサ
- **CSS Modules** - スタイルのカプセル化
- **classnames** 2.5.1 - 動的クラス管理

### HTTPクライアント
- **Axios** 1.7.9 - RESTful API通信

---

## 🔥 主要機能

- バックエンドの非同期タスク状態を反映したUIを提供
- オーディオファイルのアップロードと処理フローをサポート
- オーディオ再生と字幕の同期
- レスポンシブUI構成

---

## 📂 プロジェクト構造

```
src/
├── components/
│   └── layout/
│       ├── Layout.tsx              # メインレイアウト
│       └── Layout.module.scss
├── pages/
│   ├── Home/
│   │   ├── Home.tsx                # セッションリストページ
│   │   └── Home.module.scss
│   └── SessionDetail/
│       ├── SessionDetail.tsx       # セッション詳細（アップロード、再生、分析）
│       └── SessionDetail.module.scss
├── hooks/
│   ├── useSession.ts               # セッション管理カスタムフック
│   └── useUpload.ts                # ファイルアップロードカスタムフック
├── services/
│   └── api.ts                      # AxiosインスタンスとAPI関数
├── scss/
│   └── global.scss                 # グローバルCSS変数
├── App.tsx                         # ルーティング設定
└── main.tsx                        # アプリケーションエントリー
```

---

## 🚀 クイックスタート

### 前提条件
- Node.js 18.x 以上
- npm または yarn
- バックエンドAPIサーバーが実行中であること

### インストールと実行

```bash
# 1. 依存関係のインストール
npm install

# 2. 環境変数の設定
cp .env.example .env
# .envファイルでVITE_API_URLを設定

# 3. 開発サーバーの実行
npm run dev
```

開発サーバー: `http://localhost:5173`

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

---

## 📝 環境変数

```env
# APIサーバー
VITE_API_URL=http://localhost:5000/api
```

---

## 📊 パフォーマンス最適化

- ✅ useRefによる不要な再レンダリングの防止
- ✅ イベントリスナーのクリーンアップによるメモリリークの防止
- ✅ CSS Modulesによるスタイルの衝突防止
- ✅ Viteベースの高速HMR

---

## 🎨 デザイン

- ミント/ティール系のカラーテーマ（ロゴと統一）
- Desktop/Tablet/Mobileの完全レスポンシブ対応

---

## 📚 参考資料

- [React公式ドキュメント](https://react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/)
- [Vite公式ドキュメント](https://vitejs.dev/)
- [React Router公式ドキュメント](https://reactrouter.com/)

---

## 👤 開発者

**Gwankwon An**
- GitHub: [@ias-kim](https://github.com/ias-kim)

---

**📌 プロジェクト全体 (バックエンド含む) を見る:**
https://github.com/ias-kim/genkun
