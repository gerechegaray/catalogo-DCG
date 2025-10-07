import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

// Configuración de Firebase - TEMPORAL para pruebas
const firebaseConfig = {
  apiKey: "AIzaSyA-GAWS25Pui6oMT03uavW1anaAwDEPivc",
  authDomain: "catalogo-veterinaria-alegra.firebaseapp.com",
  projectId: "catalogo-veterinaria-alegra",
  storageBucket: "catalogo-veterinaria-alegra.firebasestorage.app",
  messagingSenderId: "43555517807",
  appId: "1:43555517807:web:0b09b4756ac6abf423249a",
  measurementId: "G-CV0W041CKJ"
}

// Configuración alternativa desde variables de entorno (si están disponibles)
const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Usar configuración de entorno si está disponible, sino usar la directa
const finalConfig = import.meta.env.VITE_FIREBASE_PROJECT_ID ? envConfig : firebaseConfig

console.log('🔥 Configuración Firebase:', finalConfig.projectId ? '✅ Cargada' : '❌ Error')

// Inicializar Firebase
const app = initializeApp(finalConfig)

// Inicializar Firestore
export const db = getFirestore(app)

// Inicializar Analytics (opcional)
export const analytics = getAnalytics(app)

export default app
