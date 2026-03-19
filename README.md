# Jason's Portfolio

個人作品集網站，使用 Nuxt 4 + Nuxt UI v4 建構，後端串接 Firebase。

## 技術棧

- **框架**：[Nuxt 4](https://nuxt.com) + [Nuxt UI v4](https://ui.nuxt.com)
- **樣式**：TailwindCSS v4（透過 `@theme {}` 自訂主題）
- **後端**：Firebase（Firestore / Auth / Storage）
- **套件管理**：pnpm
- **部署**：Firebase Hosting（靜態產生）

## 功能

- 首頁、About、Work、Blog、Contact 公開頁面
- 亮/暗模式切換（`UColorModeButton`）
- 後台 CMS（`/admin`）：文章與作品的 CRUD
- Firebase Auth 登入保護後台
- Firebase Storage 圖片上傳

## 開發

安裝依賴：

```bash
pnpm install
```

設定環境變數（複製 `.env.example` 或直接建立 `.env`）：

```env
NUXT_PUBLIC_FIREBASE_API_KEY=
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NUXT_PUBLIC_FIREBASE_PROJECT_ID=
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NUXT_PUBLIC_FIREBASE_APP_ID=
```

啟動開發伺服器（`http://localhost:3000`）：

```bash
pnpm dev
```

## 指令

```bash
pnpm dev          # 啟動開發伺服器
pnpm generate     # 靜態產生（用於 Firebase Hosting 部署）
pnpm deploy       # generate + 部署到 Firebase Hosting
pnpm build        # 建構 Node.js 伺服器（非 Hosting 用途）
pnpm preview      # 預覽生產建構
pnpm lint         # ESLint 檢查
pnpm typecheck    # Vue TSC 型別檢查
```

> **Firebase Hosting 部署請使用 `pnpm generate` 或 `pnpm deploy`，勿使用 `pnpm build`。**

## 目錄結構

```
app/
├── assets/css/main.css     # TailwindCSS 主題設定
├── components/             # 共用元件
├── composables/            # useFirebase / useAuth / usePosts / useWorks
├── layouts/
│   ├── default.vue         # 公開頁面 layout（header/footer）
│   └── admin.vue           # 後台 layout（側邊欄）
├── middleware/auth.ts       # 後台路由守衛
├── pages/
│   ├── index.vue
│   ├── about.vue
│   ├── work/
│   ├── blog/
│   ├── contact.vue
│   └── admin/
└── plugins/
    ├── firebase.client.ts           # Firebase 初始化
    └── firebase-emulators.client.ts # 開發環境 emulator 連線
```
