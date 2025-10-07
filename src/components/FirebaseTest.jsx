import React, { useState, useEffect } from 'react'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'

const FirebaseTest = () => {
  const [status, setStatus] = useState('Probando conexión...')
  const [testData, setTestData] = useState([])

  useEffect(() => {
    testFirebaseConnection()
  }, [])

  const testFirebaseConnection = async () => {
    try {
      // Probar escritura
      const testRef = await addDoc(collection(db, 'test'), {
        message: 'Conexión exitosa',
        timestamp: new Date(),
        project: 'catalogo-veterinaria-alegra'
      })
      
      setStatus('✅ Conexión exitosa!')
      
      // Probar lectura
      const snapshot = await getDocs(collection(db, 'test'))
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setTestData(data)
      
    } catch (error) {
      console.error('Error:', error)
      setStatus(`❌ Error: ${error.message}`)
    }
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔥 Prueba de Firebase</h2>
      
      <div className="mb-4">
        <p className="text-lg font-medium">Estado: {status}</p>
      </div>
      
      {testData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Datos de prueba:</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm">{JSON.stringify(testData, null, 2)}</pre>
          </div>
        </div>
      )}
      
      <button 
        onClick={testFirebaseConnection}
        className="btn-primary mt-4"
      >
        🔄 Probar Nuevamente
      </button>
    </div>
  )
}

export default FirebaseTest

