# 🔒 Guía de Implementación - Fase 5: Seguridad y Testing

## 📋 Resumen de lo que hicimos

### ✅ Completado:
1. ✅ Fase 1: Autenticación con Google
2. ✅ Fase 2: Dashboard y Perfil
3. ✅ Fase 3: Estado de Cuenta (Alegra)
4. ✅ Fase 4: Comunicaciones Personalizadas
5. 🎯 **Fase 5: Seguridad** ← ESTAMOS AQUÍ

---

## 🚀 PASO 1: Desplegar Firestore Security Rules

### Opción A: Desde Firebase Console (Más fácil)

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a **Firestore Database** → **Reglas**
4. Copia y pega el contenido de `firestore.rules`
5. Click en **Publicar**

### Opción B: Desde Terminal (CLI)

```bash
# 1. Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Navegar al proyecto
cd C:\Users\gerec\catalogo-veterinario-alegra

# 4. Desplegar reglas
firebase deploy --only firestore:rules
```

### ⚠️ IMPORTANTE: Crear colección de Admins

Las reglas necesitan una colección `admins` en Firestore:

1. Ve a **Firestore Database** → **Datos**
2. Click en **Iniciar colección**
3. ID de colección: `admins`
4. Documento ID: **Usa el UID de tu cuenta de Google** (lo encuentras en Authentication)
5. Agrega un campo:
   - **Campo:** `isAdmin` (boolean)
   - **Valor:** `true`

---

## 🛡️ PASO 2: Probar las Reglas de Seguridad

### Test 1: Cliente puede leer su propio perfil
```javascript
// En la consola del navegador (como cliente autenticado)
db.collection('clients').doc('TU_CLIENT_ID').get()
  .then(doc => console.log('✅ Éxito:', doc.data()))
  .catch(err => console.error('❌ Error:', err))
```

### Test 2: Cliente NO puede leer otro perfil
```javascript
// Intentar leer otro cliente
db.collection('clients').doc('OTRO_CLIENT_ID').get()
  .then(doc => console.log('❌ No debería funcionar'))
  .catch(err => console.error('✅ Correcto:', err.message))
```

### Test 3: Usuario sin login NO puede leer clientes
```javascript
// Desconectarte y probar
auth.signOut()
db.collection('clients').get()
  .then(docs => console.log('❌ No debería funcionar'))
  .catch(err => console.error('✅ Correcto:', err.message))
```

---

## ✅ PASO 3: Validaciones Críticas

### Validación 1: AlegraId existe antes de aprobar
Cuando un admin aprueba un cliente, verificar que el `alegraId` existe en Alegra.

**Archivo:** `src/services/clientManagementService.ts`

```typescript
async approveClient(clientId: string, data: ApproveClientData): Promise<void> {
  // TODO: Validar que alegraId existe en Alegra
  const contactExists = await alegraClientService.getContactInfo(data.alegraId)
  
  if (!contactExists) {
    throw new Error('El ID de Alegra no existe')
  }
  
  // Continuar con aprobación...
}
```

### Validación 2: Manejo de errores mejorado
Agregar try-catch a todas las operaciones críticas.

---

## 📊 PASO 4: Testing

### Tests a Realizar:

#### ✅ Test 1: Login de Cliente
- [ ] Cliente nuevo se registra con Google
- [ ] Se crea perfil en Firestore con `pendingApproval: true`
- [ ] Cliente ve mensaje "Esperando aprobación"

#### ✅ Test 2: Aprobación de Cliente
- [ ] Admin ve cliente en lista de pendientes
- [ ] Admin asigna Alegra ID y tipo
- [ ] Admin aprueba cliente
- [ ] Cliente puede acceder al portal

#### ✅ Test 3 superficie: Estado de Cuenta
- [ ] Cliente ve su saldo
- [ ] Cliente ve facturas pendientes
- [ ] Cliente NO ve facturas de otros

#### ✅ Test 4: Comunicaciones
- [ ] Anuncios aparecen en páginas públicas
- [ ] Promociones aparecen en portal de clientes
- [ ] Descuentos exclusivos solo para clientes seleccionados

#### ✅ Test 5: Seguridad
- [ ] Cliente no puede modificar su perfil
- [ ] Usuario sin login no puede ver datos de clientes
- [ ] Solo admins pueden crear comunicados

---

## 🔧 PASO 5: Implementar Funcionalidad de Admin

Crear la colección `admins` en Firestore y un servicio para validar:

**Archivo:** `src/services/adminService.ts` (nuevo)

```typescript
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export const checkIfAdmin = async (userId: string): Promise<boolean> => {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', userId))
    return adminDoc.exists() && adminDoc.data()?.isAdmin === true
  } catch (error) {
    console.error('Error checking admin:', error)
    return false
  }
}
```

Usar en el AdminPage:
```typescript
useEffect(() => {
  const validateAdmin = async () => {
    const user = auth.currentUser
    if (user) {
      const isAdmin = await checkIfAdmin(user.uid)
      if (!isAdmin) {
        // Redirigir o mostrar error
      }
    }
  }
  validateAdmin()
}, [])
```

---

## 📝 PASO 6: Documentar

Crear guías para:

1. **Administrador del Portal**
   - Cómo aprobar clientes
   - Cómo crear promociones
   - Cómo asignar descuentos exclusivos

2. **Cliente del Portal**
   - Cómo registrarse
   - Cómo ver estado de cuenta
   - Cómo ver promociones

---

## 🎯 Orden de Implementación Recomendado

1. **HOY (Crítico para producción):**
   - [ ] Desplegar Firestore Rules
   - [ ] Crear colección `admins`
   - [ ] Probar seguridad básica

2. **Próximo:**
   - [ ] Implementar validación de admin en AdminPage
   - [ ] Validar AlegraId en aprobación
   - [ ] Tests de seguridad

3. **Después:**
   - [ ] Testing completo
   - [ ] Documentación
   - [ ] Deploy a producción

---

## 🚨 IMPORTANTE: Antes de Desplegar a Producción

Verifica que:
- ✅ Todas las reglas de seguridad están implementadas
- ✅ La colección `admins` tiene al menos tu usuario
- ✅ Probaste que un usuario normal NO puede acceder a datos de admin
- ✅ Probaste que un cliente NO puede modificar datos críticos
- ✅ Backups de datos importantes

---

## 📞 Comandos Útiles

```bash
# Ver configuración actual
firebase projects:list

# Desplegar solo reglas
firebase deploy --only firestore:rules

# Ver logs de Firebase
firebase functions:log
```

