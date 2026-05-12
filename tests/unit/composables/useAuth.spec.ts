// ─────────────────────────────────────────────────────────────
// 測試目標：useAuth composable
//
// 單元測試的核心原則：
//   只測「這個 composable 自己的邏輯」，不測 Firebase 或 Nuxt 本身。
//   因此所有外部依賴都會被「假造（mock）」，讓測試不需要網路或真實服務。
// ─────────────────────────────────────────────────────────────

// ── 匯入測試語法 ──────────────────────────────────────────────
// describe：將相關測試分組（就像目錄）
// it：單一測試案例（就像一條檢查清單）
// expect：斷言某個值應該符合預期
// vi：Vitest 的工具集（建立假函式、mock 模組等）
// beforeEach：每個 it 執行前都會跑一次的前置動作
import { describe, it, expect, vi, beforeEach } from 'vitest'

// mockNuxtImport：專門用來假造 Nuxt auto-import（例如 useState、useRouter）
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

// ref：Vue 的響應式資料，讓我們可以在測試中模擬 Nuxt 的全域狀態
import { ref } from 'vue'

// 被測對象：useAuth composable
import { useAuth } from '~/composables/useAuth'

// ── 建立可提升的 mock 函式 ─────────────────────────────────────
// 問題背景：vi.mock() 會被 Vitest 自動提升到檔案最頂端執行，
//          但一般變數宣告不會提升，導致 vi.mock 工廠內無法使用外部變數。
// 解法：用 vi.hoisted() 包住，這裡面的程式碼同樣會被提升，
//       確保 mockSignIn / mockSignOut / mockUseState 在 vi.mock 工廠執行前就已存在。
//
// vi.fn() 建立一個「假函式」，可以：
//   - 追蹤被呼叫幾次（toHaveBeenCalledOnce）
//   - 追蹤傳入的參數（toHaveBeenCalledWith）
//   - 指定回傳值（mockResolvedValue / mockRejectedValue）
const { mockSignIn, mockSignOut, mockUseState } = vi.hoisted(() => ({
  mockSignIn: vi.fn(), // 代替 signInWithEmailAndPassword
  mockSignOut: vi.fn(), // 代替 signOut
  mockUseState: vi.fn() // 代替 Nuxt 的 useState
}))

// ── 假造 Firebase 模組 ────────────────────────────────────────
// vi.mock('模組路徑', 工廠函式) 會攔截這個模組的所有 import，
// 用工廠函式的回傳值取代真實實作。
// 目的：測試時不需要真實的 Firebase 連線，也不會有任何副作用。

// firebase/app：提供 Firebase 初始化，這裡只需要一個假的 initializeApp
vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }))

// firebase/firestore / storage：useAuth 不直接用到，但 firebase.client.ts
// 可能間接 import，因此也要假造避免測試環境炸掉
vi.mock('firebase/firestore', () => ({ getFirestore: vi.fn() }))
vi.mock('firebase/storage', () => ({ getStorage: vi.fn() }))

// firebase/auth：這裡最重要
//   - signInWithEmailAndPassword 換成 mockSignIn（後續測試可控制其回傳值）
//   - signOut 換成 mockSignOut
//   - onAuthStateChanged 給一個空假函式（useAuth 不一定用到，但避免 undefined 錯誤）
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: mockSignIn,
  signOut: mockSignOut
}))

// ── 假造 useFirebase composable ───────────────────────────────
// useAuth 內部會呼叫 useFirebase() 取得 auth 實例。
// 這裡把它替換成固定回傳 { auth: mockAuth, db: {}, storage: {} }。
//
// mockAuth 是一個空物件，代表「假的 Firebase Auth 實例」。
// 在測試中可以驗證 signIn/signOut 是否真的帶著這個 mockAuth 被呼叫。
const mockAuth = {}
mockNuxtImport('useFirebase', () => {
  return () => ({ auth: mockAuth, db: {}, storage: {} })
})

// ── 假造 Nuxt 的 useState ──────────────────────────────────────
// useAuth 用 useState('firebase-user') 存放目前登入的使用者。
// userState 是我們在測試中可以直接手動修改的 ref，
// 讓我們能模擬「已登入」或「未登入」的情境。
const userState = ref<object | null>(null)

// 用 mockNuxtImport 把 Nuxt 的 useState 換成 mockUseState
mockNuxtImport('useState', () => mockUseState)

// ═════════════════════════════════════════════════════════════
// 測試主體
// ═════════════════════════════════════════════════════════════
describe('useAuth', () => {
  // ── 每個測試前的重置 ───────────────────────────────────────
  // beforeEach 在每個 it（包含第一個）執行前都會跑，所以這裡是唯一需要設定的地方。
  // vi.clearAllMocks() 會清除呼叫紀錄，同時也會清掉 mockImplementation，
  // 因此每次都要重新設定，否則 mockUseState 會變回什麼都不做的空函式。
  beforeEach(() => {
    vi.clearAllMocks()
    userState.value = null
    // useState 可能被任意 key 呼叫（例如 color-mode plugin 也會用到它）。
    // 規則：'firebase-user' 這個 key 回傳我們可控的 userState ref，
    //       其他 key 則呼叫 init() 取得預設值並包成 ref（避免其他 plugin 存取 null 而炸掉）。
    mockUseState.mockImplementation((key: string, init?: () => unknown) => {
      if (key === 'firebase-user') return userState
      return ref(init?.() ?? null)
    })
  })

  // ── 1. 回傳值結構 ──────────────────────────────────────────
  // 最基本的「介面契約」測試：確認 useAuth 有回傳預期的屬性和方法。
  // 即使未來內部重構，只要對外 API 沒變，這個測試就不會壞。
  describe('回傳值結構', () => {
    it('應回傳 user, isAuthenticated, login, logout', () => {
      const auth = useAuth()

      // toHaveProperty：確認物件有這個屬性（不管值是什麼）
      expect(auth).toHaveProperty('user')
      expect(auth).toHaveProperty('isAuthenticated')
      expect(auth).toHaveProperty('login')
      expect(auth).toHaveProperty('logout')

      // 確認 login / logout 是函式，而不是其他型別
      expect(typeof auth.login).toBe('function')
      expect(typeof auth.logout).toBe('function')
    })
  })

  // ── 2. isAuthenticated 計算屬性 ────────────────────────────
  // 驗證「是否登入」的邏輯：user 為 null → false，有值 → true。
  // 透過直接設定 userState.value 來模擬不同情境。
  describe('isAuthenticated', () => {
    it('user 為 null 時應為 false', () => {
      userState.value = null // 模擬未登入
      const { isAuthenticated } = useAuth()
      // .value 是因為 isAuthenticated 是 computed ref，要存取 .value 才是真正的值
      expect(isAuthenticated.value).toBe(false)
    })

    it('user 有值時應為 true', () => {
      userState.value = { uid: 'abc123', email: 'test@example.com' } // 模擬已登入
      const { isAuthenticated } = useAuth()
      expect(isAuthenticated.value).toBe(true)
    })
  })

  // ── 3. login 方法 ──────────────────────────────────────────
  // 每個 it 都是標準三步驟：
  //   Arrange（準備）→ Act（執行）→ Assert（驗證）
  describe('login', () => {
    it('應以正確的 email 和 password 呼叫 signInWithEmailAndPassword', async () => {
      // Arrange：設定 mockSignIn 成功時回傳的假 credential
      const mockCredential = { user: { uid: 'abc123' } }
      mockSignIn.mockResolvedValue(mockCredential) // mockResolvedValue = 模擬 Promise resolve

      // Act：呼叫 login
      const { login } = useAuth()
      const result = await login('test@example.com', 'password123')

      // Assert：
      // toHaveBeenCalledOnce = 確認只被呼叫一次（不多不少）
      expect(mockSignIn).toHaveBeenCalledOnce()
      // toHaveBeenCalledWith = 確認呼叫時傳入的參數是否正確
      expect(mockSignIn).toHaveBeenCalledWith(mockAuth, 'test@example.com', 'password123')
      // toBe = 嚴格相等（=== 同一個物件參考）
      expect(result).toBe(mockCredential)
    })

    it('Firebase 拋出錯誤時應向上傳遞', async () => {
      // Arrange：設定 mockSignIn 失敗時拋出的錯誤
      mockSignIn.mockRejectedValue(new Error('auth/wrong-password')) // mockRejectedValue = 模擬 Promise reject

      // Act + Assert：rejects.toThrow 驗證 async 函式確實拋出了錯誤
      const { login } = useAuth()
      await expect(login('test@example.com', 'wrong')).rejects.toThrow('auth/wrong-password')
    })
  })

  // ── 4. logout 方法 ─────────────────────────────────────────
  // 與 login 測試結構完全相同：成功路徑 + 例外路徑
  describe('logout', () => {
    it('應以正確的 auth 實例呼叫 signOut', async () => {
      // Arrange：mockSignOut 不需要回傳任何值，resolve undefined 即可
      mockSignOut.mockResolvedValue(undefined)

      // Act：呼叫 logout
      const { logout } = useAuth()
      await logout()

      // Assert：確認 signOut 被呼叫一次，且帶著正確的 auth 實例
      expect(mockSignOut).toHaveBeenCalledOnce()
      expect(mockSignOut).toHaveBeenCalledWith(mockAuth)
    })

    it('Firebase 拋出錯誤時應向上傳遞', async () => {
      mockSignOut.mockRejectedValue(new Error('network error'))

      const { logout } = useAuth()
      await expect(logout()).rejects.toThrow('network error')
    })
  })

  // ── 5. useState key 驗證 ───────────────────────────────────
  // 防止有人不小心改掉 key 名稱（例如 'firebase-user' → 'firebaseUser'），
  // 那樣會導致 plugin 和 composable 讀到不同的 state，造成登入狀態斷線。
  describe('useState key', () => {
    it('應以 "firebase-user" 為 key 呼叫 useState', () => {
      useAuth()
      // toHaveBeenCalledWith 驗證 useState 被以正確的 key 呼叫
      expect(mockUseState).toHaveBeenCalledWith('firebase-user')
    })
  })
})
