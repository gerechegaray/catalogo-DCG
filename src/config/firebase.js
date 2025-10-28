import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { config } from './appConfig'

// Usar configuración centralizada
const firebaseConfig = config.firebase

// console.log('🔥 Configuración Firebase:', firebaseConfig.projectId ? '✅ Cargada' : '❌ Error')

// Inicializar Firebase solo si hay configuración válida
let app = null
try {
  app = initializeApp(firebaseConfig)
} catch (error) {
  console.error('❌ Error al inicializar Firebase:', error.message)
}

// Inicializar Firestore (opcional si Firebase no está configurado)
export const db = app ? getFirestore(app) : null

// Inicializar Analytics (opcional) - Solo si Firebase está configurado y hay projectId
export let analytics = null
try {
  if (app && firebaseConfig.projectId) {
    analytics = getAnalytics(app)
  }
} catch (error) {
  console.warn('⚠️ Analytics no disponible:', error.message)
}

// Inicializar Storage (opcional si Firebase no está configurado)
export const storage = app ? getStorage(app) : null

// Inicializar Authentication (opcional si Firebase no está configurado)
export const auth = app ? getAuth(app) : null

export default app
