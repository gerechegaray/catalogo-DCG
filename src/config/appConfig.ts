// Configuración centralizada de variables de entorno
export const config = {
  // Alegra Configuration
  alegra: {
    apiKey: import.meta.env.VITE_ALEGRA_API_KEY || 'gerechegaray@gmail.com:79e207afe8c4464a8d90',
    baseURL: import.meta.env.VITE_ALEGRA_BASE_URL || 'https://api.alegra.com/api/v1'
  },
  
  // Firebase Configuration
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA-GAWS25Pui6oMT03uavW1anaAwDEPivc',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'catalogo-veterinaria-alegra.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'catalogo-veterinaria-alegra',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'catalogo-veterinaria-alegra.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '43555517807',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:43555517807:web:0b09b4756ac6abf423249a',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-CV0W041CKJ'
  }
}

// Debug de configuración
// console.log('🔍 Config Debug - import.meta.env:', import.meta.env)
// console.log('🔍 Config Debug - config:', config)

// Validación de configuración
export const validateConfig = () => {
  const warnings = []
  
  // Verificar si estamos usando valores por defecto
  if (!import.meta.env.VITE_ALEGRA_API_KEY) {
    warnings.push('⚠️ VITE_ALEGRA_API_KEY no encontrada, usando valor por defecto')
  }
  
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    warnings.push('⚠️ VITE_FIREBASE_API_KEY no encontrada, usando valor por defecto')
  }
  
  if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    warnings.push('⚠️ VITE_FIREBASE_PROJECT_ID no encontrada, usando valor por defecto')
  }
  
  if (warnings.length > 0) {
    console.warn('🔧 Configuración:', warnings.join(', '))
    // console.log('✅ Sistema funcionando con valores por defecto para desarrollo')
  } else {
    // console.log('✅ Todas las variables de entorno cargadas correctamente')
  }
  
  return true // Siempre retorna true para permitir desarrollo
}

export default config
