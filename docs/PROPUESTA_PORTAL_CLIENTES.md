# 🎯 Propuesta: Portal de Clientes DCG Distribuciones

**Fecha:** ${new Date().toLocaleDateString('es-CO')}

## 📋 Resumen Ejecutivo

Implementar un sistema de autenticación y portal personalizado donde cada cliente (veterinario o pet shop) pueda:
- Registrarse con su ID de Alegra
- Iniciar sesión de forma segura
- Ver promociones y anuncios personalizados
- Consultar estados de cuenta desde Alegra
- Acceder a información exclusiva según su perfil

---

## 🏗️ Arquitectura Propuesta

### 1. **Sistema de Autenticación con Firebase Authentication**

#### Ventajas:
- ✅ **Integración nativa** con el proyecto actual (ya tienes Firebase)
- ✅ **Seguridad enterprise-grade** (Google Cloud)
- ✅ **Sin costos adicionales** de servidor de autenticación
- ✅ **Escalable** automáticamente
- ✅ **SDK fácil** de integrar con React

#### Flujo de Registro:
```
Cliente → Inicia Registro → Ingresa:
1. Email corporativo
2. ID de Alegra (asignado por administrador o auto-verificado)
3. Tipo de cliente (VET o PET)
4. Password seguro
→ Firebase crea cuenta → Guarda perfil en Firestore
```

#### Flujo de Login:
```
Cliente → Inicia Sesión → Email/Password
→ Firebase valida → Carga perfil desde Firestore
→ Establece sesión → Redirige a dashboard personalizado
```

---

### 2. **Estructura de Datos en Firestore**

#### Colección: `clients`

```typescript
interface ClientProfile {
  // Información básica
  id: string                    // Firebase Auth UID
  email: string                 // Email de login
  alegraId: string              // ID de Alegra (CRÍTICO para integración)
  type: 'vet' | 'pet'           // Tipo de cliente
  
  // Información de perfil
  businessName: string          // Nombre del negocio
  contactName: string           // Nombre del contacto
  phone: string                 // Teléfono
  address?: string              // Dirección
  
  // Configuración
  isActive: boolean             // Cliente activo
  registrationDate: Date        // Fecha de registro
  lastLogin: Date               // Último acceso
  
  // Preferencias
  preferredPriceList?: string   // Lista de precios preferida
  communicationPreferences?: {
    email: boolean
    whatsapp: boolean
    sms: boolean
  }
  
  // Metadata
  createdBy: string             // Admin que creó el cliente
  notes?: string                // Notas internas
}
```

#### Colección: `account_statements`

```typescript
interface AccountStatement {
  clientId: string              // ID del cliente
  alegraId: string              // ID de Alegra para integración
  period: string                // Período (ej: "2025-01")
  balance: number               // Saldo
  pendingAmount: number         // Monto pendiente
  overdueAmount: number         // Monto vencido
  lastPaymentDate?: Date        // Última fecha de pago
  updatedAt: Date               // Última actualización
  
  // Detalles de facturación desde Alegra
  invoices?: Array<{
    invoiceNumber: string
    date: Date
    amount: number
    status: 'pending' | 'paid' | 'overdue'
    dueDate: Date
  }>
}
```

---

### 3. **Integración con Alegra API**

#### Nuevo Servicio: `alegraClientService.ts`

```typescript
class AlegraClientService {
  // Obtener información del cliente desde Alegra
  async getClientInfo(alegraId: string): Promise<ClientInfo>
  
  // Obtener facturas del cliente
  async getClientInvoices(alegraId: string, filters?: InvoiceFilters): Promise<Invoice[]>
  
  // Obtener pagos del cliente
  async getClientPayments(alegraId: string): Promise<Payment[]>
  
  // Calcular saldo pendiente
  async calculateClientBalance(alegraId: string): Promise<AccountBalance>
  
  // Obtener cotizaciones del cliente
  async getClientQuotes(alegraId: string): Promise<Quote[]>
}
```

#### Endpoints de Alegra a usar:
- `GET /contacts/{id}` - Información del contacto
- `GET /invoices?client={alegraId}` - Facturas del cliente
- `GET /payments?client={alegraId}` - Pagos realizados
- `GET /estimates?client={alegraId}` - Cotizaciones

---

### 4. **Sistema de Promociones y Anuncios**

#### Extender `communicationsService.js`:

Ya existe el sistema de comunicados. Podemos extend metadatos para incluir:

```typescript
interface Communication {
  // ... campos existentes
  targetClients?: {
    all: boolean               // Todos los clientes
    specificIds?: string[]     // IDs específicos de clientes
    clientTypes?: ('vet' | 'pet')[]
    byState?: string[]         // Filtrar por estado de cuenta
  }
  priority: 'low' | 'medium' | 'high'
  readBy?: string[]            // Clientes que ya lo leyeron
}
```

#### Dashboard del Cliente mostrará:
- Preheatudes según prioridad
- Anuncios de productos nuevos
- Promociones especiales
- Notificaciones de vencimientos
- Estado de pedidos

---

## 🎨 Interfaz de Usuario

### Páginas Nuevas:

1. **`/login`** - Página de inicio de sesión
   - Formulario email/password
   - Link a registro
   - Recuperación de contraseña
   - OAuth con Google (opcional futuro)

2. **`/register`** - Registro de cliente
   - Formulario con ID de Alegra
   - Validación de ID existente
   - Selección tipo VET/PET
   - Términos y condiciones

3. **`/dashboard`** - Panel principal del cliente
   - Resumen de cuenta (saldo, pendientes)
   - Promociones activas
   - Productos destacados
   - Pedidos recientes

4. **`/account`** - Estado de cuenta
   - Historial de facturas
   - Pagos realizados
   - Saldo pendiente
   - Descarga de comprobantes (PDF)

5. **`/promotions`** - Centro de promociones
   - Lista de todas las promociones
   - Filtros por tipo
   - Ver más detalles

6. **`/profile`** - Perfil del cliente
   - Editar información personal
   - Cambiar contraseña
   - Preferencias de comunicación

---

## 🔐 Seguridad

### 1. Autenticación
- ✅ Firebase Authentication (email/password)
- ✅ Tokens JWT gestionados por Firebase
- ✅ Sesiones persistentes con refresh tokens
- ✅ Protección de rutas con `ProtectedRoute`

### 2. Autorización
- ✅ Cliente solo puede ver SU información
- ✅ ID de Alegra validado al registrarse
- ✅ Firestore Security Rules para proteger datos
- ✅ Validación en backend (no solo frontend)

### 3. Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para clientes
    match /clients/{clientId} {
      // Solo el cliente puede leer su perfil
      allow read: if request.auth != null && request.auth.uid == clientId;
      
      // Solo admins pueden escribir
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Reglas para estados de cuenta
    match /account_statements/{statementId} {
      allow read: if request.auth != null && 
        resource.data.clientId == request.auth.uid;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

---

## 📊 Ventajas de esta Arquitectura

### 1. **Escalabilidad**
- Firebase escala automáticamente
- No necesitas gestionar servidores
- Preparado para miles de clientes

### 2. **Integración**
- Conexión directa con Alegra API
- Usa el mismo sistema de productos existente
- Comparte Firebase/Alegra con el admin panel

### 3. **Costo**
- Firebase tier gratuito generoso
- Solo pagas por uso extra
- Sin costos de infraestructura

### 4. **Mantenimiento**
- Código en un solo repositorio
- Misma base tecnológica (React + Firebase)
- Actualizaciones centralizadas

### 5. **Experiencia del Cliente**
- Login rápido y seguro
- Dashboard personalizado
- Promociones relevantes
- Transparencia en estado de cuenta

---

## 🚀 Plan de Implementación (Fases)

### **Fase 1: Fundación (Semana 1-2)**
- [ ] Configurar Firebase Authentication
- [ ] Crear colecciones en Firestore
- [ ] Implementar Firestore Security Rules
- [ ] Crear servicio `alegraClientService.ts`
- [ ] Crear página de Login/Registro básica

### **Fase 2: Perfiles (Semana 2-3)**
- [ ] Implementar AuthContext extendido
- [ ] Crear página de Dashboard
- [ ] Sistema de registro de clientes
- [ ] Validación de ID de Alegra
- [ ] Página de perfil del cliente

### **Fase 3: Estados de Cuenta (Semana 3-4)**
- [ ] Integración completa con Alegra API
- [ ] Sincronización de facturas
- [ ] Página de estado de cuenta
- [ ] Generación de reportes PDF
- [ ] Notificaciones de vencimientos

### **Fase 4: Promociones (Semana 4-5)**
- [ ] Extender sistema de comunicados
- [ ] Filtrado por cliente/estado
- [ ] Dashboard de promociones
- [ ] Sistema de "marcar como leído"
- [ ] Push notifications (opcional)

### **Fase 5: Mejoras y Testing (Semana 5-6)**
- [ ] Testing completo
- [ ] Optimización de performance
- [ ] Documentación
- [ ] Capacitación a usuarios
- [ ] Deploy a producción

---

## 🛠️ Componentes a Crear

### Servicios:
```
src/services/
├── alegraClientService.ts      [NUEVO]
├── clientAuthService.ts        [NUEVO]
└── clientService.ts            [NUEVO]
```

### Contextos:
```
src/context/
├── ClientAuthContext.tsx       [NUEVO] - Maneja autenticación de clientes
└── ClientContext.tsx           [NUEVO] - Gestión de perfil y datos del cliente
```

### Páginas:
```
src/pages/
├── ClientLoginPage.tsx         [NUEVO]
├── ClientRegisterPage.tsx      [NUEVO]
├── ClientDashboardPage.tsx     [NUEVO]
├── ClientAccountPage.tsx       [NUEVO]
├── ClientPromotionsPage.tsx    [NUEVO]
└── ClientProfilePage.tsx       [NUEVO]
```

### Componentes:
```
src/components/
├── ClientNavbar.tsx            [NUEVO] - Navbar personalizado para clientes
├── AccountSummaryCard.tsx      [NUEVO] - Resumen de cuenta
├── InvoiceList.tsx             [NUEVO] - Lista de facturas
├── PromotionCard.tsx           [NUEVO] - Tarjeta de promoción
└── ProtectedClientRoute.tsx    [NUEVO] - Protección de rutas para clientes
```

### Tipos:
```
src/types/
├── client.ts                   [NUEVO] - Tipos para clientes
└── account.ts                  [NUEVO] - Tipos para estados de cuenta
```

---

## 📈 Métricas y Analytics

### Trackear:
- Clientes registrados
- Tasa de login exitoso
- Tiempo promedio en el portal
- Promociones más vistas
- Solicitudes de estado de cuenta
- Descargas de facturas

---

## 💡 Funcionalidades Adicionales (Futuro)

1. **Carrito de Compras Persistente**
   - Guardar carrito en Firebase
   - Sincronizar entre dispositivos
   - Recordar últimos productos

2. **Sistema de Puntos/Fidelidad**
   - Acumular puntos por compras
   - Canjear por descuentos
   - Gamificación

3. **Chat/WhatsApp Integrado**
   - Chat en vivo desde el portal
   - Historial de conversaciones
   - Soporte 24/7

4. **Pedidos en Línea**
   - Checkout completo
   - Historial de pedidos
   - Seguimiento en tiempo real

5. **Recomendaciones Personalizadas**
   - IA para sugerir productos
   - Basado en historial de compras
   - Mejora experiencia UX

---

## ❓ Preguntas de Implementación

### 1. **¿Cómo obtener IDs de Alegra de clientes existentes?**
**Solución:** Integrar con `/contacts` de Alegra y mapear con emails de Firebase.

### 2. **¿Qué pasa si el ID de Alegra cambia?**
**Solución:** Sistema de sincronización que actualiza automáticamente.

### 3. **¿Cómo manejar múltiples usuarios por cliente?**
**Solución:** Sistema de sub-usuarios en el perfil del cliente.

### 4. **¿Qué datos mostrar del estado de cuenta?**
**Solución:** Saldo total, facturas pendientes, próximos vencimientos, historial.

### 5. **¿Cómo recuperar contraseña?**
**Solución:** Firebase Auth incluye reset de password por email automáticamente.

---

## 🎯 Conclusión

Esta arquitectura te permite:
- ✅ **Autenticación robusta** sin infraestructura adicional
- ✅ **Integración perfecta** con Alegra
- ✅ **Personalización** por cliente
- ✅ **Escalabilidad** automática
- ✅ **Costos controlados**

**¿Te parece bien esta propuesta? ¿Qué cambios o consideraciones adicionales necesitas?**


