# 🔧 Guía de Instalación - Catálogo Veterinario Alegra

Esta guía te llevará paso a paso para configurar el proyecto en tu entorno local.

## 📋 Prerrequisitos

### Software Requerido
- **Node.js**: Versión 18 o superior
- **npm**: Versión 8 o superior (viene con Node.js)
- **Git**: Para clonar el repositorio

### Cuentas Necesarias
- **Alegra ERP**: Cuenta activa con acceso a la API
- **Firebase**: Proyecto configurado con Authentication y Firestore

## 🚀 Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/gerechegaray/catalogo-DCG.git
cd catalogo-veterinario-alegra
```

### 2. Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- React 19 y dependencias relacionadas
- Vite para el bundling
- Tailwind CSS para estilos
- Firebase SDK
- Testing libraries (Jest, Testing Library)

### 3. Configurar Variables de Entorno

#### Crear archivo .env
```bash
cp env.example .env
```

#### Configurar variables en .env
```env
# Alegra API Configuration
VITE_ALEGRA_API_KEY=tu_email:tu_token_aqui
VITE_ALEGRA_BASE_URL=https://api.alegra.com/api/v1

# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

### 4. Configurar Alegra API

#### Obtener credenciales de Alegra:
1. Inicia sesión en [Alegra](https://app.alegra.com/)
2. Ve a **Configuración** → **API**
3. Genera un nuevo token de API
4. Copia el formato: `email:token`

#### Configurar en .env:
```env
VITE_ALEGRA_API_KEY=mi_email@ejemplo.com:mi_token_generado
```

### 5. Configurar Firebase

#### Crear proyecto en Firebase:
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Authentication** con Email/Password
4. Habilita **Firestore Database**
5. Ve a **Configuración del proyecto** → **General**
6. Copia las credenciales de configuración

#### Configurar en .env:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=mi-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mi-proyecto
VITE_FIREBASE_STORAGE_BUCKET=mi-proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123DEF
```

### 6. Ejecutar el Proyecto

```bash
npm run dev
```

El proyecto estará disponible en: `http://localhost:5173`

## 🔍 Verificación de la Instalación

### 1. Verificar que el proyecto carga correctamente
- Abre `http://localhost:5173`
- Deberías ver la página principal del catálogo

### 2. Verificar la conexión con Alegra
- Abre las herramientas de desarrollador (F12)
- Ve a la consola
- Deberías ver mensajes de conexión exitosa con Alegra

### 3. Verificar Firebase
- Intenta hacer login
- Debería funcionar la autenticación

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build

# Testing
npm test             # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Reporte de cobertura

# Linting
npm run lint         # Verificar código
```

## 🐛 Solución de Problemas

### Error: "Module not found"
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Firebase configuration"
- Verifica que todas las variables de entorno estén correctas
- Asegúrate de que el proyecto de Firebase esté activo

### Error: "Alegra API connection"
- Verifica que el token de Alegra sea válido
- Confirma que tengas permisos de API en tu cuenta de Alegra

### Puerto 5173 ocupado
```bash
# Usar otro puerto
npm run dev -- --port 3000
```

## 📁 Estructura de Archivos Importantes

```
├── .env                 # Variables de entorno (NO commitear)
├── env.example          # Ejemplo de variables de entorno
├── src/
│   ├── config/
│   │   ├── appConfig.ts # Configuración centralizada
│   │   └── firebase.js  # Configuración de Firebase
│   ├── services/
│   │   └── alegraService.ts # Servicio de Alegra API
│   └── context/
│       └── AuthContext.tsx  # Contexto de autenticación
```

## 🔒 Seguridad

### Variables de Entorno
- **NUNCA** commitees el archivo `.env`
- Usa valores de ejemplo en `env.example`
- Mantén las credenciales seguras

### Firebase Security Rules
Asegúrate de configurar reglas de seguridad apropiadas en Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📞 Soporte

Si encuentras problemas durante la instalación:

1. Revisa esta guía paso a paso
2. Verifica que todos los prerrequisitos estén instalados
3. Consulta la [Documentación Técnica](TECHNICAL.md)
4. Abre un issue en el repositorio

---

✅ ¡Una vez completados estos pasos, tendrás el proyecto funcionando localmente!
