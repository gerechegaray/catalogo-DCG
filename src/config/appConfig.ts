// Configuración centralizada de variables de entorno
// IMPORTANTE: Nunca hardcodear credenciales aquí
// Usa archivo .env para desarrollo
export const config = {
  // Alegra Configuration
  alegra: {
    apiKey: import.meta.env.VITE_ALEGRA_API_KEY || '',
    baseURL: import.meta.env.VITE_ALEGRA_BASE_URL || 'https://api.alegra.com/api/v1'
  },
  
  // Firebase Configuration
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
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
