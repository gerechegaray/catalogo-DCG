// Función para reemplazar automáticamente el archivo de configuración
export const replaceConfigFile = async (configContent) => {
  try {
    // Crear el contenido del archivo
    const fileContent = `// Configuración de marcas y laboratorios
export const brandsConfig = ${JSON.stringify(configContent, null, 2)}

// Función para obtener configuración por tipo de usuario
export const getBrandsConfig = (userType) => {
  return brandsConfig[userType] || brandsConfig.veterinarios
}`

    // En un entorno de desarrollo, no podemos escribir archivos directamente
    // Pero podemos mostrar el contenido y permitir copiarlo
    console.log('📄 Contenido del archivo generado:')
    console.log(fileContent)
    
    // Crear un blob y descargar automáticamente
    const blob = new Blob([fileContent], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'brandsConfig.js'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Mostrar instrucciones al usuario
    alert(`✅ Archivo generado y descargado automáticamente!
    
📋 Instrucciones:
1. El archivo 'brandsConfig.js' se ha descargado
2. Reemplaza el archivo en: src/config/brandsConfig.js
3. El servidor se recargará automáticamente
4. Los cambios se aplicarán inmediatamente

💡 Tip: En producción, esto se hará automáticamente.`)

    return true
  } catch (error) {
    console.error('Error al generar archivo:', error)
    throw error
  }
}

// Función para mostrar el contenido en pantalla (alternativa)
export const showConfigContent = (configContent) => {
  const fileContent = `// Configuración de marcas y laboratorios
export const brandsConfig = ${JSON.stringify(configContent, null, 2)}

// Función para obtener configuración por tipo de usuario
export const getBrandsConfig = (userType) => {
  return brandsConfig[userType] || brandsConfig.veterinarios
}`

  // Crear ventana modal con el contenido
  const modal = document.createElement('div')
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
  modal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-4xl max-h-96 overflow-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Contenido del archivo brandsConfig.js</h3>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">${fileContent}</pre>
      <div class="flex justify-end gap-2 mt-4">
        <button onclick="navigator.clipboard.writeText(\`${fileContent.replace(/`/g, '\\`')}\`); alert('Copiado al portapapeles!')" 
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          📋 Copiar
        </button>
        <button onclick="this.closest('.fixed').remove()" 
                class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
          Cerrar
        </button>
      </div>
    </div>
  `
  
  document.body.appendChild(modal)
}

// Función para reemplazo automático en producción (usando API)
export const replaceConfigFileProduction = async (configContent) => {
  try {
    // En producción, esto se haría mediante una API call
    // que actualizaría el archivo en el servidor
    
    const response = await fetch('/api/update-brands-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ config: configContent })
    })

    if (!response.ok) {
      throw new Error('Error al actualizar configuración en el servidor')
    }

    const result = await response.json()
    
    // Recargar la página para aplicar cambios
    window.location.reload()
    
    return result
  } catch (error) {
    console.error('Error en producción:', error)
    // Fallback a descarga manual
    return replaceConfigFile(configContent)
  }
}

// Función para detectar si estamos en desarrollo o producción
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1'
}

// Función principal que decide qué método usar
export const applyConfigChanges = async (configContent) => {
  if (isDevelopment()) {
    // En desarrollo: descarga automática con instrucciones
    return await replaceConfigFile(configContent)
  } else {
    // En producción: reemplazo automático via API
    return await replaceConfigFileProduction(configContent)
  }
}