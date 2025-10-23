// Configuración centralizada de variables de entorno
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
console.log('🔍 Config Debug - import.meta.env:', import.meta.env)
console.log('🔍 Config Debug - config:', config)

// Validación de configuración
export const validateConfig = () => {
  const errors = []
  
  // Verificar variables críticas
  if (!config.alegra.apiKey) {
    errors.push('❌ VITE_ALEGRA_API_KEY es requerida')
  }
  
  if (!config.firebase.apiKey) {
    errors.push('❌ VITE_FIREBASE_API_KEY es requerida')
  }
  
  if (!config.firebase.projectId) {
    errors.push('❌ VITE_FIREBASE_PROJECT_ID es requerida')
  }
  
  if (errors.length > 0) {
    console.error('🔧 Configuración:', errors.join(', '))
    throw new Error(`Variables de entorno faltantes: ${errors.join(', ')}`)
  }
  
  console.log('✅ Todas las variables de entorno cargadas correctamente')
  return true
}

export default config
