# 專案結構說明

本文件說明根目錄每個檔案與目錄的用途，以及為何各自放置於現有位置。

---

## 目錄概覽

```
portfolio-2026/
├── app/                    # Nuxt 應用程式原始碼（source root）
├── docs/                   # 專案說明文件
├── firebase/               # Firebase 規則與索引定義
├── public/                 # 靜態資源（Nuxt 直接提供服務）
├── tests/                  # Vitest 單元測試
│
├── firebase.json           # Firebase CLI 主設定
├── .firebaserc             # Firebase 專案別名設定
├── nuxt.config.ts          # Nuxt 框架設定
├── tsconfig.json           # TypeScript 設定
├── vitest.config.ts        # Vitest 測試設定
├── eslint.config.mjs       # ESLint 程式碼風格設定
├── .nuxtrc                 # Nuxt 執行階段設定
│
├── package.json            # 專案依賴與腳本
├── pnpm-lock.yaml          # pnpm 鎖定版本檔（自動產生）
├── pnpm-workspace.yaml     # pnpm 工作區設定
├── renovate.json           # Renovate 自動更新依賴設定
│
├── CLAUDE.md               # Claude Code AI 輔助說明
├── README.md               # 專案說明（顯示於 GitHub）
├── LICENSE                 # 授權條款
├── .editorconfig           # 編輯器縮排與編碼一致性設定
├── .gitignore              # Git 忽略清單
├── .env                    # 環境變數（本地，不進 Git）
└── serviceAccount.json     # Firebase 服務帳號金鑰（本地，不進 Git）
```

---

## 目錄說明

### `app/`
Nuxt 4 的 source root。所有頁面、元件、composables、layout、middleware、plugin 都放在這裡。`~/` alias 指向此目錄。

```
app/
├── assets/css/main.css     # TailwindCSS v4 主題設定（@theme {}）
├── components/             # 共用 Vue 元件
├── composables/            # useFirebase / useAuth / usePosts / useWorks
├── layouts/
│   ├── default.vue         # 公開頁面 layout（header / footer）
│   └── admin.vue           # 後台 layout（側邊欄）
├── middleware/auth.ts      # 後台路由守衛
├── pages/                  # 路由頁面（/ /about /work /blog /contact /admin）
└── plugins/
    ├── firebase.client.ts           # Firebase 初始化與 $firebase 注入
    └── firebase-emulators.client.ts # 開發環境 emulator 自動連線
```

### `docs/`
專案說明文件。不影響任何建構流程，純粹供開發者閱讀。

### `firebase/`
Firebase 規則與索引定義，由 Firebase CLI 讀取（路徑設定於 `firebase.json`）。

```
firebase/
├── firestore.rules         # Firestore 安全規則
├── firestore.indexes.json  # Firestore 複合索引定義
└── storage.rules           # Cloud Storage 安全規則
```

### `public/`
Nuxt 靜態資源目錄，檔案會直接對應到網站根路徑。例如 `public/favicon.ico` → `https://example.com/favicon.ico`。

### `tests/`
Vitest 單元測試，`vitest.config.ts` 設定掃描路徑為 `tests/unit/**/*.spec.ts`。

---

## 根目錄設定檔說明

### Firebase 相關

| 檔案 | 說明 | 為何在根目錄 |
|------|------|------------|
| `firebase.json` | Firebase CLI 主設定（Hosting、Emulators、規則檔路徑） | Firebase CLI 要求 |
| `.firebaserc` | 綁定 Firebase 專案別名（`default` 對應哪個 project ID） | Firebase CLI 要求 |

### Nuxt 相關

| 檔案 | 說明 | 為何在根目錄 |
|------|------|------------|
| `nuxt.config.ts` | 路由規則（SSG/CSR）、runtime config、模組設定 | Nuxt 要求 |
| `.nuxtrc` | Nuxt 執行階段旗標（例如 `compatibilityDate`） | Nuxt 要求 |

### TypeScript / 工具鏈

| 檔案 | 說明 | 為何在根目錄 |
|------|------|------------|
| `tsconfig.json` | TypeScript 編譯選項，extends 自 `.nuxt/tsconfig.json` | TS 編譯器要求 |
| `vitest.config.ts` | 測試環境（`nuxt`）、測試路徑、setup 檔案 | Vitest 要求 |
| `eslint.config.mjs` | Flat config 格式；啟用 `@nuxt/eslint` stylistic 規則 | ESLint 要求 |
| `.editorconfig` | 統一各編輯器的縮排（2 spaces）、換行、編碼 | 編輯器慣例 |

### 套件管理

| 檔案 | 說明 | 為何在根目錄 |
|------|------|------------|
| `package.json` | 依賴宣告、`scripts`（dev/build/generate/deploy） | Node.js 生態系要求 |
| `pnpm-lock.yaml` | pnpm 鎖定版本，確保所有環境安裝相同版本 | pnpm 自動產生 |
| `pnpm-workspace.yaml` | pnpm 工作區設定 | pnpm 要求 |
| `renovate.json` | Renovate bot 自動提 PR 更新依賴的設定 | GitHub App 要求 |

### 版本控制 / 文件

| 檔案 | 說明 |
|------|------|
| `.gitignore` | 排除 `.nuxt/`、`.output/`、`node_modules/`、`.env`、`serviceAccount.json`、`*.log` |
| `README.md` | 專案簡介、技術棧、開發指令（GitHub 首頁顯示） |
| `LICENSE` | 授權條款 |
| `CLAUDE.md` | Claude Code 輔助工具的說明（指令、架構、規範），Claude Code 要求在根目錄 |

### 本地機密（不進 Git）

| 檔案 | 說明 |
|------|------|
| `.env` | Firebase 設定的環境變數（`NUXT_PUBLIC_FIREBASE_*`） |
| `serviceAccount.json` | Firebase 服務帳號 JSON 金鑰（本地 emulator 與部署用） |

> 以上兩個檔案均已列於 `.gitignore`，不會被提交。

---

## 自動產生目錄（可隨時刪除重建）

| 目錄 | 說明 |
|------|------|
| `.nuxt/` | Nuxt 開發建構快取，`pnpm dev` 時產生 |
| `.output/` | 生產建構輸出，`pnpm generate` 或 `pnpm build` 時產生 |
| `node_modules/` | pnpm 安裝的依賴，`pnpm install` 時產生 |
| `dist` | symlink → `.output/public`，供 Firebase CLI 使用 |
