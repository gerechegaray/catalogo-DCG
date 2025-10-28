# 🔥 Guía: Configuración Firebase Authentication con Google OAuth

**Fecha:** ${new Date().toLocaleDateString('es-CO')}

## 📋 Índice

1. [Configurar Google en Firebase Console](#paso-1-configurar-google-en-firebase-console)
2. [Configurar Código Firebase](#paso-2-configurar-código-firebase)
3. [Verificar Configuración](#paso-3-verificar-configuración)

---

## 🎯 Paso 1: Configurar Google en Firebase Console

### 1.1 Abrir Firebase Console

1. Ve a https://console.firebase.google.com/
2. Selecciona tu proyecto: `catalogo-veterinaria-alegra`

### 1.2 Habilitar Google Authentication

1. En el menú izquierdo, busca y haz click en: **"Authentication"** (o "Autenticación")
2. Click en la pestaña: **"Sign-in method"** (o "Métodos de inicio de sesión")
3. Verás una lista de "Providers" (Proveedores de autenticación)

### 1.3 Configurar Google Provider

1. En la lista, busca **"Google"** y haz click
2. Activa el toggle: **"Enable"** (Habilitar)
3. Se abrirá un modal con campos:

#### Campos a completar:

**📧 Support email:**
- Ingresa: `gerechegaray@gmail.com` (tu email)

**✏️ Project support email:**
- El mismo email se auto-completa

**💾 Project configuration:**
- Firebase te dará:
  - Web client ID
  - Web client secret
- NO los necesitas copiar manualmente (Firebase los maneja)

4. Click en **"Save"** (Guardar)

### 1.4 Configurar Dominios Autorizados

1. En la misma página de Google Provider, ve a la pestaña: **"Authorized domains"** (Dominios autorizados)
2. Ya deberías ver:
   - `localhost` (para desarrollo)
   - `catalogo-veterinaria-alegra.firebaseapp.com` (tu dominio Firebase)

**✅ Verificar:** Si ves `localhost` ya está listo para desarrollo local.

### 1.5 (Opcional) Agregar Otro Dominio para Producción

Si tienes un dominio personalizado para producción (ej: `portal.dcgalegra.com`):

1. Click en **"Add domain"** (Agregar dominio)
2. Ingresa tu dominio
3. Click en **"Add"**

---

## ✅ Checklist de Configuración Firebase

Marcar cuando completes cada paso:

- [ ] Authentication habilitado en Firebase Console
- [ ] Google Provider activado
- [ ] Support email configurado
- [ ] Dominios autorizados verificados
- [ ] localhost está en la lista de dominios

---

## 🎯 Paso 2: Configurar Código Firebase

Ahora vamos a actualizar tu código para usar Authentication.

### 2.1 Actualizar `firebase.js`

Ya verificamos que tienes `firebase/auth` en tus dependencias. Ahora vamos a importarlo.

**Archivo:** `src/config/firebase.js`

```javascript-air
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from 'firebase/storage'
import { xxxx } from 'firebase/auth'  // ← AGREGAR ESTA LÍNEA
import { config } from './appConfig'

// Usar configuración centralizada
const firebaseConfig = config.firebase

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar Firestore
export const db = getFirestore(app)

// Inicializar Analytics (opcional)
export const analytics = getAnalytics(app)

// Inicializar Storage
export const storage = getStorage(app)

// Inicializar Auth  // ← AGREGAR ESTAS LÍNEAS
export const auth = getAuth(app)

export default app
```

### 2.2 Crear Tipos TypeScript

Crear archivo de tipos para el cliente.

---

## 🧪 Paso 3: Verificar Configuración

### 3.1 Prueba Rápida en Consola

Abre tu terminal y ejecuta:

```bash
npm run dev
```

### 3.2 Verificar en Browser

1. Abre http://localhost:5173 (o el puerto que te indique Vite)
2. Abre la consola del navegador (F12)
3. Deberías ver que no hay errores relacionados con Firebase Auth

---

## 📝 Notas Importantes

### ⚠️ Errores Comunes

1. **"Firebase: Error (auth/unauthorized-domain)**
   - **Causa:** Tu dominio no está autorizado
   - **Solución:** Verifica que `localhost` está en Authorized domains

2. **"Firebase: Error (auth/popup-closed-by-user)"**
   - **Causa:** El usuario cerró el popup de Google
   - **Solución:** Normal, no es un error

3. **"Firebase: Error (auth/operation-not-allowed)"**
   - **Causa:** Google Provider no está habilitado
   - **Solución:** Ve al Paso 1.3 y habilita Google

---

## ✅ Resumen de lo que Hicimos

1. ✅ Habilitamos Google Authentication en Firebase Console
2. ✅ Configuramos dominios autorizados
3. ✅ Importamos `getAuth` en el código
4. ✅ Inicializamos `auth` para usarlo en la app

---

## 🚨 IMPORTANTE: Antes de Continuar

**¡ALTO!** Antes de seguir con el código, debes completar manualmente el **Paso 1** en Firebase Console:

1. Ve a https://console.firebase.google.com/
2. Selecciona tu proyecto
3. Habilitar Google en Authentication
4. Guardar

**¿Ya lo hiciste?** Si SÍ, puedes continuar con la creación de componentes.

**¿Todavía no?** Hazlo ahora antes de continuar.

---

## 🎯 Siguiente Paso

Crear los componentes de UI:
1. `GoogleAuthButton.tsx` - Botón para iniciar sesión
2. `ClientLoginPage.tsx` - Página de login
3. `PendingApprovalMessage.tsx` - Mensaje de espera

