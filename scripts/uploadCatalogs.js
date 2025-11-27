// Script para subir catálogos JSON a Firebase Storage
import { initializeApp, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Cargar variables de entorno desde .env
function loadEnv() {
  const envPath = join(process.cwd(), '.env')
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        const value = valueParts.join('=').trim()
        if (key.trim()) {
          process.env[key.trim()] = value
        }
      }
    })
  }
}

loadEnv()

async function uploadCatalogs() {
  try {
    console.log('🔄 Iniciando subida de catálogos a Firebase Storage...')
    
    // Verificar que los archivos existan
    const vetPath = join(process.cwd(), 'veterinarios.json')
    const petPath = join(process.cwd(), 'petshops.json')
    
    if (!existsSync(vetPath)) {
      throw new Error('❌ Archivo veterinarios.json no encontrado. Ejecuta primero generateCatalogs.js')
    }
    
    if (!existsSync(petPath)) {
      throw new Error('❌ Archivo petshops.json no encontrado. Ejecuta primero generateCatalogs.js')
    }
    
    // Leer archivos JSON
    console.log('📖 Leyendo archivos JSON...')
    const vetContent = readFileSync(vetPath, 'utf8')
    const petContent = readFileSync(petPath, 'utf8')
    
    // Verificar que sean JSON válidos
    JSON.parse(vetContent)
    JSON.parse(petContent)
    
    console.log('✅ Archivos JSON válidos')
    
    // Inicializar Firebase Admin
    // Intentar usar credenciales de servicio si están disponibles
    const serviceAccountPath = join(process.cwd(), 'serviceAccountKey.json')
    let app
    
    if (existsSync(serviceAccountPath)) {
      console.log('🔑 Usando credenciales de servicio...')
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
      app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || `${process.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`
      })
    } else {
      // Intentar usar variables de entorno
      console.log('⚠️  No se encontró serviceAccountKey.json')
      console.log('💡 Intentando usar variables de entorno...')
      
      // Para desarrollo local, podríamos usar el emulador o necesitar credenciales
      throw new Error('❌ Se requiere serviceAccountKey.json para subir archivos.\n' +
        '   Obtén las credenciales en: Firebase Console > Configuración del proyecto > Cuentas de servicio\n' +
        '   Guarda el archivo JSON como serviceAccountKey.json en la raíz del proyecto')
    }
    
    const bucket = getStorage().bucket()
    
    // Subir catálogo de veterinarios
    console.log('📤 Subiendo veterinarios.json...')
    const vetFile = bucket.file('catalog/veterinarios.json')
    await vetFile.save(vetContent, {
      metadata: {
        contentType: 'application/json',
        cacheControl: 'public, max-age=3600', // Cache de 1 hora
      },
    })
    console.log('✅ veterinarios.json subido exitosamente')
    
    // Subir catálogo de pet shops
    console.log('📤 Subiendo petshops.json...')
    const petFile = bucket.file('catalog/petshops.json')
    await petFile.save(petContent, {
      metadata: {
        contentType: 'application/json',
        cacheControl: 'public, max-age=3600',
      },
    })
    console.log('✅ petshops.json subido exitosamente')
    
    // Hacer los archivos públicos
    await vetFile.makePublic()
    await petFile.makePublic()
    console.log('✅ Archivos configurados como públicos')
    
    console.log('')
    console.log('🎉 ¡Catálogos subidos exitosamente a Firebase Storage!')
    console.log('')
    console.log('📋 Archivos disponibles en:')
    console.log('   - catalog/veterinarios.json')
    console.log('   - catalog/petshops.json')
    console.log('')
    console.log('💡 Los productos se actualizarán automáticamente en la aplicación')
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error subiendo catálogos:', error.message)
    console.error('')
    console.error('💡 Alternativa: Sube los archivos manualmente desde Firebase Console')
    console.error('   1. Ve a Firebase Console > Storage')
    console.error('   2. Selecciona la carpeta "catalog"')
    console.error('   3. Sube "veterinarios.json" y "petshops.json"')
    process.exit(1)
  }
}

uploadCatalogs()

