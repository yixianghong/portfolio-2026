import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { mockSignIn, mockSignOut, mockUseState } = vi.hoisted(() => ({
  mockSignIn: vi.fn(),
  mockSignOut: vi.fn(),
  mockUseState: vi.fn()
}))

vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }))
vi.mock('firebase/firestore', () => ({ getFirestore: vi.fn() }))
vi.mock('firebase/storage', () => ({ getStorage: vi.fn() }))
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: mockSignIn,
  signOut: mockSignOut
}))

const mockAuth = {}
mockNuxtImport('useFirebase', () => {
  return () => ({ auth: mockAuth, db: {}, storage: {} })
})

const userState = ref<object | null>(null)
mockNuxtImport('useState', () => mockUseState)

// 設定 mockUseState 預設實作：'firebase-user' key 回傳受控的 ref
// 其他 key（如 @nuxtjs/color-mode 的 'color-mode'）必須呼叫 init 函式，
// 否則回傳 null 會導致 color-mode plugin 存取 null.preference / null.forced
mockUseState.mockImplementation((key: string, init?: () => unknown) => {
  if (key === 'firebase-user') return userState
  return ref(init?.() ?? null)
})

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks() // 清除呼叫記錄但不清除 mockImplementation
    userState.value = null
    // vi.clearAllMocks 後需重新設定實作，否則 mockUseState 沒有 implementation
    mockUseState.mockImplementation((key: string, init?: () => unknown) => {
      if (key === 'firebase-user') return userState
      return ref(init?.() ?? null)
    })
  })

  describe('回傳值結構', () => {
    it('應回傳 user, isAuthenticated, login, logout', () => {
      const auth = useAuth()
      expect(auth).toHaveProperty('user')
      expect(auth).toHaveProperty('isAuthenticated')
      expect(auth).toHaveProperty('login')
      expect(auth).toHaveProperty('logout')
      expect(typeof auth.login).toBe('function')
      expect(typeof auth.logout).toBe('function')
    })
  })

  describe('isAuthenticated', () => {
    it('user 為 null 時應為 false', () => {
      userState.value = null
      const { isAuthenticated } = useAuth()
      expect(isAuthenticated.value).toBe(false)
    })

    it('user 有值時應為 true', () => {
      userState.value = { uid: 'abc123', email: 'test@example.com' }
      const { isAuthenticated } = useAuth()
      expect(isAuthenticated.value).toBe(true)
    })
  })

  describe('login', () => {
    it('應以正確的 email 和 password 呼叫 signInWithEmailAndPassword', async () => {
      const mockCredential = { user: { uid: 'abc123' } }
      mockSignIn.mockResolvedValue(mockCredential)

      const { login } = useAuth()
      const result = await login('test@example.com', 'password123')

      expect(mockSignIn).toHaveBeenCalledOnce()
      expect(mockSignIn).toHaveBeenCalledWith(mockAuth, 'test@example.com', 'password123')
      expect(result).toBe(mockCredential)
    })

    it('Firebase 拋出錯誤時應向上傳遞', async () => {
      mockSignIn.mockRejectedValue(new Error('auth/wrong-password'))

      const { login } = useAuth()
      await expect(login('test@example.com', 'wrong')).rejects.toThrow('auth/wrong-password')
    })
  })

  describe('logout', () => {
    it('應以正確的 auth 實例呼叫 signOut', async () => {
      mockSignOut.mockResolvedValue(undefined)

      const { logout } = useAuth()
      await logout()

      expect(mockSignOut).toHaveBeenCalledOnce()
      expect(mockSignOut).toHaveBeenCalledWith(mockAuth)
    })

    it('Firebase 拋出錯誤時應向上傳遞', async () => {
      mockSignOut.mockRejectedValue(new Error('network error'))

      const { logout } = useAuth()
      await expect(logout()).rejects.toThrow('network error')
    })
  })

  describe('useState key', () => {
    it('應以 "firebase-user" 為 key 呼叫 useState', () => {
      useAuth()
      expect(mockUseState).toHaveBeenCalledWith('firebase-user')
    })
  })
})
