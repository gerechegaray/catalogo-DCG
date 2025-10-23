import '@testing-library/jest-dom'

// Polyfills para Jest
import { TextEncoder, TextDecoder } from 'util'

// @ts-ignore
global.TextEncoder = TextEncoder
// @ts-ignore
global.TextDecoder = TextDecoder

// Mock de Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => [])
}))

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  where: jest.fn(),
  serverTimestamp: jest.fn(() => new Date())
}))

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn()
}))

// Mock de window.cacheService
Object.defineProperty(window, 'cacheService', {
  value: {
    recordWhatsAppClick: jest.fn(),
    recordProductView: jest.fn(),
    recordProductSelection: jest.fn()
  },
  writable: true
})

// Mock de fetch global
global.fetch = jest.fn()

// Mock de import.meta.env para Jest
const originalImportMeta = globalThis.import

beforeAll(() => {
  // Mock de import.meta.env
  Object.defineProperty(globalThis, 'import', {
    value: {
      meta: {
        env: {
          VITE_ALEGRA_API_KEY: 'test-api-key',
          VITE_ALEGRA_BASE_URL: 'https://test-api.com',
          VITE_FIREBASE_API_KEY: 'test-firebase-key',
          VITE_FIREBASE_PROJECT_ID: 'test-project'
        }
      }
    },
    writable: true
  })
})

afterAll(() => {
  // Restaurar import.meta original
  if (originalImportMeta) {
    Object.defineProperty(globalThis, 'import', {
      value: originalImportMeta,
      writable: true
    })
  }
})

// Mock de window.open
Object.defineProperty(window, 'open', {
  value: jest.fn(),
  writable: true
})

// Configurar console para tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
