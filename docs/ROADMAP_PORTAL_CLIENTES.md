# 🗺️ Roadmap: Portal de Clientes DCG

**Proyecto:** Implementación de autenticación y portal personalizado para clientes  
**Fecha de inicio:** ${new Date().toLocaleDateString('es-CO')}

---

## 📋 Índice

1. [Fase 1: Fundación de Autenticación](#fase-1-fundación-de-autenticación)
2. [Fase 2: Perfil y Dashboard del Cliente](#fase-2-perfil-y-dashboard-del-cliente)
3. [Fase 3: Integración con Alegra](#fase-3-integración-con-alegra)
4. [Fase 4: Comunicaciones Personalizadas](#fase-4-comunicaciones-personalizadas)
5. [Fase 5: Seguridad y Testing](#fase-5-seguridad-y-testing)

---

## 🎯 Fase 1: Fundación de Autenticación

### Objetivo
Configurar Firebase Authentication con **Google OAuth** y crear el sistema básico de login/registro de clientes.

**¡Ventajas de Google Auth!**
- ✅ Sin contraseñas que gestionar
- ✅ Más seguro (Google maneja la seguridad)
- ✅ Mejor UX (un solo click)
- ✅ Menos campos en el formulario

### Tareas

#### 1.1 Configurar Firebase Authentication con Google OAuth
- [ ] Instalar dependencia `firebase/auth` (ya está en package.json)
- [ ] Agregar configuración de auth en `src/config/firebase.js`
- [ ] Habilitar **Google** como provider en Firebase Console
- [ ] Configurar dominios autorizados en Firebase
- [ ] Configurar consent screen en Google Cloud Console

**Archivos a modificar:**
- `src/config/firebase.js`

**Pasos en Firebase Console:**
1. Ir a Authentication → Sign-in method
2. Habilitar Google como provider
3. Configurar support email
4. Guardar configuración

#### 1.2 Crear Estructura de Firestore
- [ ] Crear colección `clients` en Firestore
- [ ] Diseñar schema de datos del cliente

**Colección `clients` schema:**
```typescript
{
  id: string                      // Firebase Auth UID (auto)
  
  // Datos de Google (auto-llenados)
  email: string                   // De Google
  displayName: string             // Nombre de Google
  photoURL?: string               // Foto de Google
  
  // Datos asignados por Admin (manual)
  alegraId?: string               // ID de Alegra (asignado por admin)
  type?: 'vet' | 'pet'            // Tipo (asignado por admin)
  businessName?: string           // Nombre del negocio
  contactPhone?: string           // Teléfono de contacto
  
  // Estado de la cuenta
  pendingApproval: boolean        // true = esperando aprobación
  isActive: boolean               // true = puede usar el portal
  approvedBy?: string             // Admin que aprobó
  approvedAt?: Timestamp          // Fecha de aprobación
  
  // Metadata
  createdAt: Timestamp
  lastLogin?: Timestamp
  notes?: string                  // Notas internas del admin
}
```

**Colección `client_sessions`** (opcional, para tracking)

#### 1.3 Crear Servicio de Autenticación
- [ ] Crear `src/services/clientAuthService.ts`
- [ ] Implementar funciones:
  - `signInWithGoogle()` - Login con Google OAuth
  - `registerClientWithGoogle(googleUserInfo)` - Registro automático con datos de Google
  - `getCurrentClient()` - Obtener cliente actual
  - `logoutClient()` - Cerrar sesión
  - `checkClientStatus()` - Verificar si está activo/pendiente
  - `updateClientProfile(updates)` - Actualizar perfil

**Flujo de Primera Vez:**
1. Cliente hace click en "Iniciar con Google"
2. Google OAuth abre
3. Cliente autoriza
4. Se crea perfil en Firestore con estado `pendingApproval: true`
5. Cliente ve mensaje: "Esperando aprobación del administrador"
6. Admin revisa solicitud en Firebase Console
7. Admin asigna `alegraId` y `type` (vet/pet)
8. Admin cambia `pendingApproval: false`, `isActive: true`
9. Cliente puede usar el portal completo

**Flujo de Cliente Activo:**
1. Cliente hace click en "Iniciar con Google"
2. Google OAuth abre
3. Login directo → Dashboard

**Archivos nuevos:**
- `src/services/clientAuthService.ts`
- `src/services/__tests__/clientAuthService.test.ts`

#### 1.4 Crear Tipos TypeScript
- [ ] Crear `src/types/client.ts` con interfaces
- [ ] Interfaces: 
  - `Client` - Estructura completa del cliente
  - `ClientProfile` - Perfil público del cliente  
  - `PendingClient` - Cliente pendiente de aprobación

**Ejemplo:**
```typescript
export interface Client {
  id: string
  email: string
  displayName: string
  photoURL?: string
  alegraId?: string
  type?: 'vet' | 'pet'
  pendingApproval: boolean
  isActive: boolean
  // ... más campos
}
```

**Archivos nuevos:**
- `src/types/client.ts`

#### 1.5 Crear Páginas de Auth
- [ ] `src/pages/ClientLoginPage.tsx` - Página de login/registro
- [ ] Componente: `GoogleAuthButton.tsx` - Botón "Iniciar con Google"
- [ ] Componente: `PendingApprovalMessage.tsx` - Mensaje de espera
- [ ] Redirect según estado del cliente
- [ ] Mensajes de error/éxito

**UX del Flujo:**
```
Cliente → Click "Iniciar con Google"
       → Google OAuth (autorización)
       → [Nuevo] Mensaje: "Esperando aprobación del administrador"
       → Admin asigna datos en Firebase Console
       → [Aprobado] Redirect a Dashboard
```

**Archivos nuevos:**
- `src/pages/ClientLoginPage.tsx`
- `src/components/GoogleAuthButton.tsx`
- `src/components/PendingApprovalMessage.tsx`

**Componente: `PendingApprovalMessage.tsx`**
```tsx
<div>
  <h2>¡Bienvenido!</h2>
  <p>Tu cuenta está pendiente de aprobación.</p>
  <p>Nos pondremos en contacto contigo pronto.</p>
</div>
```

#### 1.6 Extender Router
- [ ] Agregar ruta `/client/login` 
- [ ] Preparar estructura para rutas protegidas (ej: `/client/dashboard`, `/client/profile`)

**Estructura de rutas:**
```
/client/login          - Login con Google
/client/dashboard      - Dashboard principal (protegida)
/client/profile        - Perfil del cliente (protegida)
/client/account        - Estado de cuenta (protegida)
```

**Archivos a modificar:**
- `src/App.jsx`

### Entregables Fase 1
✅ Clientes pueden iniciar sesión con Google (un solo click!)  
✅ Nuevos clientes ven mensaje de "Esperando Aprobación"  
✅ Admin asigna manualmente `alegraId` y `type` desde Firebase Console  
✅ Perfil guardado en Firestore con datos de Google  
✅ Clientes aprobados acceden automáticamente al portal  
✅ Estructura base lista para siguiente fase

**Tiempo estimado:** 2-3 días de desarrollo

---

## 🏗️ Fase 2: Perfil y Dashboard del Cliente

### Objetivo
Crear el dashboard principal y gestionar el perfil del cliente autenticado. Además, agregar interfaz admin para gestionar solicitudes de clientes.

### Tareas

#### 2.1 Extender AuthContext
- [ ] Modificar `src/context/AuthContext.tsx`
- [ ] Agregar estado de cliente autenticado
- [ ] Función `loginClient()` y `logoutClient()`
- [ ] Detectar si usuario es cliente o admin

**Archivos a modificar:**
- `src/context/AuthContext.tsx`

**O crear nuevo:**
- `src/context/ClientAuthContext.tsx` (recomendado, separación de concerns)

#### 2.2 Crear Dashboard
- [ ] `src/pages/ClientDashboardPage.tsx`
- [ ] Componente: `AccountSummaryCard.tsx` - Resumen de cuenta
- [ ] Componente: `RecentActivityCard.tsx` - Actividad reciente
- [ ] Componente: `QuickActionsCard.tsx` - Acciones rápidas

**Archivos nuevos:**
- `src/pages/ClientDashboardPage.tsx`
- `src/components/AccountSummaryCard.tsx`
- `src/components/RecentActivityCard.tsx`
- `src/components/QuickActionsCard.tsx`

#### 2.3 Crear Página de Perfil
- [ ] `src/pages/ClientProfilePage.tsx`
- [ ] Formulario para editar información
- [ ] Cambio de contraseña
- [ ] Vista de información de su perfil Alegra

**Archivos nuevos:**
- `src/pages/ClientProfilePage.tsx`

#### 2.4 Crear Navbar para Clientes
- [ ] `src/components/ClientNavbar.tsx`
- [ ] Menu específico para clientes
- [ ] Botón de logout
- [ ] Indicador de usuario logueado

**Archivos nuevos:**
- `src/components/ClientNavbar.tsx`

#### 2.5 Protección de Rutas
- [ ] Crear `src/components/ProtectedClientRoute.tsx`
- [ ] Verificar autenticación de cliente
- [ ] Redirigir a login si no está autenticado

**Archivos nuevos:**
- `src/components/ProtectedClientRoute.tsx`

#### 2.6 Interfaz Admin para Gestionar Clientes
**Crítico:** El admin gestiona clientes pendientes desde AdminPage (no solo Firebase Console)

**Funcionalidades:**

1. **Lista de Clientes Pendientes**
   - Ver todos los clientes con `pendingApproval: true`
   - Mostrar: foto, nombre, email, fecha de solicitud
   - Filtro de búsqueda por nombre o email
   - Indicador de cuántos hay pendientes

2. **Formulario de Aprobación**
   - Input para `alegraId`
   - Select para `type` (Veterinario / Pet Shop)
   - **Carga automática:** Al ingresar `alegraId`, el sistema:
     - Llama a Alegra API (`GET /contacts/{alegraId}`)
     - Obtiene: nombre, teléfono, dirección, tipo de cliente
     - Auto-completa campos: `businessName`, `contactPhone`
     - El admin solo edita si es necesario
   - Inputs pre-llenados (editables): `businessName`, `contactPhone`
   - Textarea para `notes` (notas internas)
   - Botón: "Aprobar y Activar"
   - Botón: "Rechazar" (con motivo)
   
   **UX del flujo:**
   ```
   Admin escribe alegraId → Sistema busca en Alegra
                          → Campos se auto-completan
                          → Admin verifica y ajusta
                          → Aprobar
   ```

3. **Lista de Clientes Activos**
   - Ver todos los clientes aprobados
   - Información: tipo, alegraId, última sesión
   - Desactivar cuenta si necesario
   - Editar información

**Componentes a crear:**
- [ ] `src/components/PendingClientsList.tsx`
- [ ] `src/components/ApproveClientForm.tsx`
- [ ] `src/components/ActiveClientsList.tsx`
- [ ] `src/services/clientManagementService.ts` (servicio para CRUD de clientes)
- [ ] `src/services/alegraClientService.ts` - Obtener datos de cliente desde Alegra

**Ejemplo de integración:**
```typescript
// En ApproveClientForm.tsx
const loadClientFromAlegra = async (alegraId) => {
  const clientData = await alegraClientService.getContactInfo(alegraId)
  setFormData({
    businessName: clientData.name || '',
    contactPhone: clientData.phone || '',
    // ... más campos
  })
}
```

**Archivos a modificar:**
- `src/pages/AdminPage.jsx` (agregar tabs o secciones)
- Agregar navegación entre: "Clientes Pendientes" | "Clientes Activos"

### Entregables Fase 2
✅ Dashboard funcional  
✅ Cliente puede ver y editar su perfil  
✅ Navegación dedicada para clientes  
✅ Rutas protegidas funcionando  
✅ Admin puede gestionar clientes pendientes desde AdminPage (interfaz completa)

**Tiempo estimado:** 3-4 días de desarrollo (ahora incluye gestión admin completa)

---

## 🔌 Fase 3: Integración con Alegra

### Objetivo
Integrar con Alegra API para:
1. Migrar datos del cliente al asignar `alegraId` (Fase 2)
2. Mostrar estados de cuenta y facturas

### Tareas

#### 3.1 Crear Servicio de Alegra para Clientes
- [ ] `src/services/alegraClientService.ts`
- [ ] Funciones:
  - `getContactInfo(alegraId)` - **Info del cliente desde Alegra**
    - Retorna: name, phone, address, type, identificationNumber
    - **Usado en Fase 2 para auto-completar datos al aprobar**
  - `getClientInfo(alegraId)` - Info extendida del cliente
  - `getClientInvoices(alegraId)` - Facturas
  - `getClientPayments(alegraId)` - Pagos
  - `getClientBalance(alegraId)` - Saldo

**Nota importante:** La función `getContactInfo()` **ya se usa en Fase 2** para auto-completar datos del cliente cuando el admin asigna el `alegraId`.

**Archivos nuevos:**
- `src/services/alegraClientService.ts`

#### 3.2 Crear Página de Estado de Cuenta
- [ ] `src/pages/ClientAccountPage.tsx`
- [ ] Componente: `InvoiceList.tsx` - Lista de facturas
- [ ] Componente: `PaymentHistory.tsx` - Historial de pagos
- [ ] Componente: `BalanceSummary.tsx` - Resumen de saldos

**Archivos nuevos:**
- `src/pages/ClientAccountPage.tsx`
- `src/components/InvoiceList.tsx`
- `src/components/PaymentHistory.tsx`
- `src/components/BalanceSummary.tsx`

#### 3.3 Funcionalidad de Descarga
- [ ] Generar PDFs de facturas
- [ ] Descargar comprobantes
- [ ] Usar servicio existente `pdfService.js` o extenderlo

**Archivos a modificar:**
- `src/services/pdfService.js`

#### 3.4 Sincronización de Datos
- [ ] Crear Cloud Function para sincronizar datos de Alegra
- [ ] O sincronizar desde frontend (según requerimiento)

### Entregables Fase 3
✅ Integración con Alegra funcionando  
✅ Cliente ve su estado de cuenta  
✅ Cliente ve facturas y pagos  
✅ Descarga de documentos

**Tiempo estimado:** 3-4 días de desarrollo

---

## 📢 Fase 4: Comunicaciones Personalizadas

### Objetivo
Extender el sistema de comunicaciones para mostrar promociones personalizadas a cada cliente.

### Tareas

#### 4.1 Extender Sistema de Comunicados
- [ ] Modificar `src/services/communicationsService.js`
- [ ] Agregar campo `targetClients` con filtros
- [ ] Función `getClientCommunications(clientId)`

**Archivos a modificar:**
- `src/services/communicationsService.js`

#### 4.2 Crear Página de Promociones
- [ ] `src/pages/ClientPromotionsPage.tsx`
- [ ] Componente: `PromotionCard.tsx` - Tarjeta de promoción
- [ ] Filtros por tipo de promoción
- [ ] Marcado de "leído"

**Archivos nuevos:**
- `src/pages/ClientPromotionsPage.tsx`
- `src/components/PromotionCard.tsx`

#### 4.3 Dashboard con Promociones
- [ ] Agregar sección de promociones destacadas en dashboard
- [ ] Mostrar "nuevas" vs "ya vistas"

**Archivos a modificar:**
- `src/pages/ClientDashboardPage.tsx`

#### 4.4 Notificaciones en Dashboard
- [ ] Mostrar notificaciones de:
  - Vencimientos próximos
  - Promociones nuevas
  - Mensajes importantes

### Entregables Fase 4
✅ Promociones personalizadas funcionando  
✅ Cliente ve solo comunicaciones relevantes  
✅ Dashboard con notificaciones  
✅ Sistema de "marcar como leído"

**Tiempo estimado:** 2-3 días de desarrollo

---

## 🔒 Fase 5: Seguridad y Testing

### Objetivo
Implementar seguridad completa y testing exhaustivo.

### Tareas

#### 5.1 Firestore Security Rules
- [ ] Modificar `storage.rules` o crear `firestore.rules`
- [ ] Reglas para colección `clients`
- [ ] Reglas para colección `account_statements`
- [ ] Reglas para colección `communications` (extensión)

**Archivos a modificar:**
- `storage.rules` o crear `firestore.rules`

**Ejemplo de reglas:**
```javascript
match /clients/{clientId} {
  // Cliente solo puede leer SU perfil
  allow read: if request.auth != null && 
              request.auth.uid == clientId;
  
  // Solo admins pueden escribir
  allow write: if request.auth != null && 
               get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isAdmin == true;
}
```

#### 5.2 Testing
- [ ] Tests unitarios para `clientAuthService.ts`
- [ ] Tests de integración para páginas
- [ ] Tests de reglas de seguridad
- [ ] Tests E2E (opcional)

**Archivos nuevos:**
- `src/services/__tests__/clientAuthService.test.ts`
- Tests en componentes existentes

#### 5.3 Validaciones y Manejo de Errores
- [ ] Validar que alegraId existe antes de registro
- [ ] Manejo de errores de API
- [ ] Mensajes de error amigables
- [ ] Logging de errores

#### 5.4 Documentación
- [ ] Documentar APIs de clientes
- [ ] Guía de uso para administradores
- [ ] Documentar flujos de autenticación

**Archivos nuevos:**
- `docs/CLIENT_PORTAL_GUIDE.md`

### Entregables Fase 5
✅ Security Rules implementadas  
✅ Testing completo  
✅ Sistema robusto y seguro  
✅ Documentación completa

**Tiempo estimado:** 2-3 días de desarrollo

---

## 📊 Resumen del Roadmap

### Timeline Total: ~15-20 días de desarrollo

| Fase | Duración | Prioridad | Dependencias |
|------|----------|-----------|--------------|
| Fase 1 | 2-3 días | 🔴 Crítica | Ninguna |
| Fase 2 | 2-3 días | 🔴 Crítica | Fase 1 |
| Fase 3 | 3-4 días | 🟡 Alta | Fase 1, 2 |
| Fase 4 | 2-3 días | 🟢 Media | Fase 2 |
| Fase 5 | 2-3 días | 🔴 Crítica | Todas las anteriores |

### Decisiones Tomadas ✅

- ✅ **Contexto de Auth:** Crear `ClientAuthContext.tsx` separado (recomendación aceptada)
- ✅ **Autenticación:** Google OAuth desde el inicio (¡no email/password!)
- ✅ **Rutas:** Prefijo `/client/*` para todas las páginas de clientes
- ✅ **Aprobación Manual:** Admin asigna `alegraId` y `type` manualmente desde Firebase Console
- ✅ **Estado Pendiente:** Clientes nuevos tienen `pendingApproval: true` hasta ser aprobados

### Decisiones Pendientes
- [ ] ¿Sincronización con Alegra desde frontend o Cloud Function?
- [ ] ¿Múltiples usuarios por cliente desde el inicio o después?

---

## 🎯 MVP (Producto Mínimo Viable)

**¿Qué es un MVP?**
Es la versión más simple pero funcional que cubre las necesidades básicas. Permite validar la idea con usuarios reales sin construir todo el sistema completo.

**MVP del Portal de Clientes:**

Para un MVP funcional, necesitamos como mínimo:

1. ✅ Fase 1 completa (Auth con Google)
2. ✅ Fase 2 - Dashboard básico con resumen
3. ✅ Fase 3 - Estado de cuenta básico (ver saldo y facturas)
4. ✅ Fase 5 - Security Rules básicas

**Esto permite al cliente:**
- ✅ Iniciar sesión con Google (super fácil)
- ✅ Ver su dashboard personalizado
- ✅ Ver estado de cuenta desde Alegra
- ✅ Navegación segura

**Lo que NO incluye el MVP:**
- ❌ Promociones personalizadas (Fase 4)
- ❌ Notificaciones avanzadas
- ❌ Múltiples usuarios por cliente
- ❌ Reportes detallados

**Tiempo MVP:** ~8-10 días

**Después del MVP:** Iterar basado en feedback real de usuarios

---

## 🚀 Próximos Pasos

1. <!-- **Decidir arquitectura:** ~~Contexto separado o extendido~~ → ✅ DECIDIDO: Separado -->
2. **Comenzar Fase 1:** Configurar Firebase Authentication con Google
3. **Iteración:** Desarrollar, probar, ajustar en cada fase
4. **Feedback:** Recibir comentarios entre fases

### 🎬 Comenzar Ahora (Opción 1)
Si quieres empezar YA, podemos comenzar con:
- Configurar Google Auth en Firebase Console
- Crear el servicio `clientAuthService.ts`
- Crear la página de login con el botón de Google

### 📚 Estudiar Primero (Opción 2)
Si prefieres revisar más antes de empezar:
- Leer la documentación de Firebase Auth
- Revisar ejemplos de Google OAuth
- Ajustar roadmap según nuevas ideas

---

## 💬 Notas

- Este roadmap es flexible y puede modificarse según necesidades
- Priorizar según urgencia del negocio
- Testing continuo durante desarrollo
- Documentar decisiones técnicas importantes
- **Google Auth simplifica mucho la implementación** (¡buena decisión!)
