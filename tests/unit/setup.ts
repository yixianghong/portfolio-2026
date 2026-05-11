import { vi } from 'vitest'

// @nuxt/ui 的色彩模式系統在 happy-dom 中需要 matchMedia
// happy-dom 可能回傳不完整的實作，導致 @nuxt/color-mode 初始化失敗
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})
