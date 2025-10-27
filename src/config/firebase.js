import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from 'firebase/storage'
import { config } from './appConfig'

// Usar configuración centralizada
const firebaseConfig = config.firebase

// console.log('🔥 Configuración Firebase:', firebaseConfig.projectId ? '✅ Cargada' : '❌ Error')

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar Firestore
export const db = getFirestore(app)

// Inicializar Analytics (opcional)
export const analytics = getAnalytics(app)

// Inicializar Storage
export const storage = getStorage(app)

export default app
