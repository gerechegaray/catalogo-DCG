import React from 'react'

const EnvTest = () => {
  const firebaseVars = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  }

  const alegraVars = {
    apiKey: import.meta.env.VITE_ALEGRA_API_KEY,
    baseUrl: import.meta.env.VITE_ALEGRA_BASE_URL
  }

  return (
    <div className="card max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔧 Prueba de Variables de Entorno</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Firebase Variables */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-veterinary-700">🔥 Firebase</h3>
          <div className="space-y-2 text-sm">
            {Object.entries(firebaseVars).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium">{key}:</span>
                <span className={`${value ? 'text-green-600' : 'text-red-600'}`}>
                  {value ? '✅ Configurado' : '❌ Faltante'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alegra Variables */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-primary-700">🛒 Alegra</h3>
          <div className="space-y-2 text-sm">
            {Object.entries(alegraVars).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium">{key}:</span>
                <span className={`${value && value !== 'tu-api-key-de-alegra-aqui' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {value && value !== 'tu-api-key-de-alegra-aqui' ? '✅ Configurado' : '⚠️ Pendiente'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-semibold mb-2">Debug Info:</h4>
        <pre className="text-xs overflow-auto">
          {JSON.stringify({ firebaseVars, alegraVars }, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default EnvTest

