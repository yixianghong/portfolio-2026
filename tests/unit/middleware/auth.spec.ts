import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import authMiddleware from '~/middleware/auth'

const { mockOnAuthStateChanged, mockNavigateTo } = vi.hoisted(() => ({
  mockOnAuthStateChanged: vi.fn(),
  mockNavigateTo: vi.fn()
}))

vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }))
vi.mock('firebase/firestore', () => ({ getFirestore: vi.fn(() => ({})) }))
vi.mock('firebase/storage', () => ({ getStorage: vi.fn(() => ({})) }))
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: mockOnAuthStateChanged,
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn()
}))

// 不 mock useNuxtApp，讓 @nuxt/test-utils 環境保持完整
// $firebase 由 firebase.client.ts plugin（使用上方 mock 的模組）自動提供
mockNuxtImport('navigateTo', () => mockNavigateTo)

describe('auth middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNavigateTo.mockResolvedValue(undefined)
  })

  describe('已登入的使用者', () => {
    beforeEach(() => {
      // 使用 Promise.resolve().then() 模擬 Firebase 的非同步行為，
      // 確保 unsubscribe 變數在 callback 呼叫前已完成賦值
      mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
        Promise.resolve().then(() => callback({ uid: 'user123', email: 'test@example.com' }))
        return vi.fn()
      })
    })

    it('有 currentUser 時不應重新導向', async () => {
      await (authMiddleware as () => Promise<void>)()
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('應呼叫 onAuthStateChanged', async () => {
      await (authMiddleware as () => Promise<void>)()
      expect(mockOnAuthStateChanged).toHaveBeenCalledWith(expect.any(Object), expect.any(Function))
    })

    it('應呼叫 unsubscribe 避免記憶體洩漏', async () => {
      const mockUnsubscribe = vi.fn()
      mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
        Promise.resolve().then(() => callback({ uid: 'user123' }))
        return mockUnsubscribe
      })

      await (authMiddleware as () => Promise<void>)()
      expect(mockUnsubscribe).toHaveBeenCalledOnce()
    })
  })

  describe('未登入的使用者', () => {
    beforeEach(() => {
      mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
        Promise.resolve().then(() => callback(null))
        return vi.fn()
      })
    })

    it('currentUser 為 null 時應導向 /admin/login', async () => {
      await (authMiddleware as () => Promise<void>)()
      expect(mockNavigateTo).toHaveBeenCalledWith('/admin/login')
    })

    it('應呼叫 unsubscribe 避免記憶體洩漏', async () => {
      const mockUnsubscribe = vi.fn()
      mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
        Promise.resolve().then(() => callback(null))
        return mockUnsubscribe
      })

      await (authMiddleware as () => Promise<void>)()
      expect(mockUnsubscribe).toHaveBeenCalledOnce()
    })
  })

  describe('非同步 Promise 包裝', () => {
    it('應等待 onAuthStateChanged callback 後才繼續', async () => {
      let resolveCallback!: (user: unknown) => void
      mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
        resolveCallback = callback
        return vi.fn()
      })

      const middlewarePromise = (authMiddleware as () => Promise<void>)()
      expect(mockNavigateTo).not.toHaveBeenCalled()

      resolveCallback(null)
      await middlewarePromise

      expect(mockNavigateTo).toHaveBeenCalledWith('/admin/login')
    })
  })
})
