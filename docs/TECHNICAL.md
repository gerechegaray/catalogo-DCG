# ⚙️ Documentación Técnica - Catálogo Veterinario Alegra

Esta documentación describe la arquitectura técnica, componentes principales y patrones de desarrollo utilizados en el proyecto.

## 🏗️ Arquitectura General

### Patrón de Arquitectura
El proyecto sigue una arquitectura de **Single Page Application (SPA)** con React, utilizando:

- **Frontend**: React 19 con Vite como bundler
- **State Management**: React Context API para estado global
- **Routing**: React Router DOM para navegación
- **Styling**: Tailwind CSS con componentes utilitarios
- **Backend Integration**: APIs REST (Alegra) y Firebase

### Flujo de Datos
```
Usuario → Componente → Context → Service → API Externa
                ↓
            Estado Local ← Context ← Service ← API Response
```

## 📁 Estructura Detallada del Proyecto

```
src/
├── components/           # Componentes UI reutilizables
│   ├── AdminLogin.jsx   # Login para administradores
│   ├── BrandManager.jsx # Gestión de marcas
│   ├── CartSidebar.jsx  # Sidebar del carrito
│   ├── CartHeader.jsx   # Header con carrito
│   ├── FeaturedProducts.jsx # Productos destacados
│   ├── FilterSidebar.jsx # Filtros laterales
│   ├── Header.jsx       # Header principal
│   ├── Footer.jsx       # Footer
│   ├── ProductCard.jsx  # Tarjeta de producto
│   └── ...
├── context/             # Contextos de React
│   ├── AuthContext.tsx  # Autenticación
│   ├── CartContext.tsx  # Carrito de compras
│   └── ProductContext.tsx # Gestión de productos
├── pages/               # Páginas principales
│   ├── HomePage.jsx     # Página de inicio
│   ├── VeterinariosPage.jsx # Catálogo veterinarios
│   ├── PetShopsPage.jsx # Catálogo pet shops
│   ├── AdminPage.jsx    # Panel administrativo
│   └── ...
├── services/            # Servicios de API
│   ├── alegraService.ts # Integración Alegra ERP
│   ├── cacheService.js  # Gestión de caché
│   ├── communicationsService.js # WhatsApp
│   └── ...
├── config/              # Configuraciones
│   ├── appConfig.ts     # Configuración centralizada
│   ├── firebase.js      # Configuración Firebase
│   └── brandsConfig.js  # Configuración de marcas
├── types/               # Definiciones TypeScript
│   ├── alegra.ts       # Tipos de Alegra API
│   ├── contexts.ts     # Tipos de contextos
│   └── whatsapp.ts     # Tipos de WhatsApp
└── utils/               # Utilidades
    ├── configFileManager.js # Gestión de archivos
    └── populateBrands.js    # Poblado de marcas
```

## 🔄 Contextos de React

### AuthContext
**Ubicación**: `src/context/AuthContext.tsx`

**Propósito**: Maneja la autenticación de usuarios con Firebase

**Estado**:
```typescript
interface AuthState {
  user: User | null
  loading: boolean
  isAdmin: boolean
}
```

**Métodos principales**:
- `login(email, password)`: Autenticación de usuario
- `logout()`: Cerrar sesión
- `checkAdminStatus()`: Verificar rol de administrador

### CartContext
**Ubicación**: `src/context/CartContext.tsx`

**Propósito**: Gestión del carrito de compras

**Estado**:
```typescript
interface CartState {
  items: CartItem[]
  total: number
  isOpen: boolean
}
```

**Métodos principales**:
- `addToCart(product)`: Agregar producto
- `removeFromCart(id)`: Eliminar producto
- `updateQuantity(id, quantity)`: Actualizar cantidad
- `clearCart()`: Vaciar carrito

### ProductContext
**Ubicación**: `src/context/ProductContext.tsx`

**Propósito**: Gestión de productos y filtros

**Estado**:
```typescript
interface ProductState {
  products: Product[]
  filteredProducts: Product[]
  filters: FilterState
  loading: boolean
}
```

## 🔌 Servicios Principales

### AlegraService
**Ubicación**: `src/services/alegraService.ts`

**Propósito**: Integración con Alegra ERP API

**Métodos principales**:
```typescript
class AlegraService {
  async getAllProducts(): Promise<NormalizedProduct[]>
  async getProductById(id: string): Promise<NormalizedProduct>
  async getPriceLists(): Promise<AlegraPriceList[]>
  async searchProducts(query: string): Promise<NormalizedProduct[]>
}
```

**Características**:
- Paginación automática
- Normalización de datos
- Manejo de errores
- Caché de respuestas

### CacheService
**Ubicación**: `src/services/cacheService.js`

**Propósito**: Gestión de caché local para optimizar rendimiento

**Métodos principales**:
```javascript
class CacheService {
  set(key, data, ttl)     // Guardar en caché
  get(key)               // Obtener de caché
  clear()                // Limpiar caché
  isExpired(key)         // Verificar expiración
}
```

### CommunicationsService
**Ubicación**: `src/services/communicationsService.js`

**Propósito**: Integración con WhatsApp para comunicaciones

**Funcionalidades**:
- Envío de mensajes automáticos
- Plantillas de mensajes
- Gestión de contactos

## 🎨 Componentes Principales

### Header
**Ubicación**: `src/components/Header.jsx`

**Propósito**: Navegación principal y autenticación

**Características**:
- Logo y navegación
- Botón de login/logout
- Responsive design

### CartSidebar
**Ubicación**: `src/components/CartSidebar.jsx`

**Propósito**: Panel lateral del carrito de compras

**Funcionalidades**:
- Lista de productos seleccionados
- Cálculo de totales
- Botones de acción (eliminar, actualizar)
- Integración con WhatsApp

### ProductCard
**Ubicación**: `src/components/ProductCard.jsx`

**Propósito**: Tarjeta individual de producto

**Props**:
```typescript
interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  showAddButton?: boolean
}
```

### FilterSidebar
**Ubicación**: `src/components/FilterSidebar.jsx`

**Propósito**: Panel de filtros para productos

**Filtros disponibles**:
- Categorías
- Marcas
- Rango de precios
- Características específicas

## 🛣️ Sistema de Rutas

### Estructura de Rutas
```javascript
/                           # Página de inicio (pública)
/veterinarios              # Landing veterinarios (protegida)
/veterinarios/productos     # Catálogo veterinarios (protegida)
/petshops                  # Landing pet shops (protegida)
/petshops/productos         # Catálogo pet shops (protegida)
/productos/:id              # Detalle de producto (protegida)
/admin                     # Panel administrativo (admin)
/contacto                  # Página de contacto (pública)
```

### Protección de Rutas
- **ProtectedRoute**: Requiere autenticación
- **AdminRoute**: Requiere rol de administrador
- **PublicRoute**: Acceso libre

## 🔧 Configuración

### appConfig.ts
**Ubicación**: `src/config/appConfig.ts`

**Propósito**: Configuración centralizada de variables de entorno

```typescript
export const config = {
  alegra: {
    apiKey: string
    baseURL: string
  },
  firebase: {
    apiKey: string
    authDomain: string
    projectId: string
    // ... más configuraciones
  }
}
```

### firebase.js
**Ubicación**: `src/config/firebase.js`

**Propósito**: Inicialización de Firebase

**Servicios configurados**:
- Authentication
- Firestore Database
- Storage (opcional)

## 🧪 Testing

### Estructura de Tests
```
src/
├── context/__tests__/     # Tests de contextos
├── services/__tests__/    # Tests de servicios
└── setupTests.ts         # Configuración de tests
```

### Configuración Jest
**Archivo**: `jest.config.js`

**Características**:
- Soporte para TypeScript
- Testing Library para React
- Coverage reports
- Mock de módulos

### Ejecutar Tests
```bash
npm test              # Tests una vez
npm run test:watch    # Tests en modo watch
npm run test:coverage # Con reporte de cobertura
```

## 🚀 Optimizaciones

### Lazy Loading
- Páginas cargadas bajo demanda
- Componentes con `React.lazy()`
- Suspense para loading states

### Caché
- Caché local de productos
- TTL configurable
- Invalidación automática

### Bundle Optimization
- Code splitting automático
- Tree shaking
- Minificación en producción

## 🔒 Seguridad

### Autenticación
- Firebase Authentication
- Tokens JWT
- Roles de usuario

### Variables de Entorno
- Credenciales en variables de entorno
- Validación de configuración
- Valores por defecto para desarrollo

### API Security
- Autenticación básica para Alegra
- HTTPS obligatorio
- Rate limiting (implementar)

## 📊 Monitoreo y Logs

### Console Logs
- Logs de desarrollo con prefijos
- Debug de configuración
- Tracking de errores

### Performance
- Bundle analyzer disponible
- Métricas de carga
- Optimización de imágenes

## 🔄 Flujo de Desarrollo

### Git Workflow
1. Feature branch desde `main`
2. Desarrollo con tests
3. Pull request con review
4. Merge a `main`

### Code Quality
- ESLint para linting
- Prettier para formato
- TypeScript para tipos
- Tests obligatorios

---

Esta documentación se actualiza constantemente. Para contribuir, consulta la [Guía de Desarrollo](DEVELOPMENT.md).
