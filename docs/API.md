# 🔌 Guía de APIs - Catálogo Veterinario Alegra

Esta documentación describe todas las integraciones con APIs externas utilizadas en el proyecto.

## 📋 APIs Integradas

- **Alegra ERP API**: Gestión de productos e inventario
- **Firebase API**: Autenticación y base de datos
- **WhatsApp Business API**: Comunicaciones (opcional)

## 🏢 Alegra ERP API

### Configuración

**Base URL**: `https://api.alegra.com/api/v1`

**Autenticación**: Basic Auth
```javascript
headers: {
  'Authorization': `Basic ${btoa(apiKey + ':')}`,
  'Content-Type': 'application/json'
}
```

### Endpoints Utilizados

#### 1. Obtener Productos
```http
GET /items?start={offset}&limit={limit}
```

**Parámetros**:
- `start`: Offset para paginación (default: 0)
- `limit`: Cantidad de items por página (default: 30)

**Respuesta**:
```json
[
  {
    "id": "123",
    "name": "Producto Veterinario",
    "description": "Descripción del producto",
    "reference": "REF001",
    "price": 15000,
    "tax": 19,
    "category": {
      "id": "1",
      "name": "Medicamentos"
    },
    "brand": {
      "id": "1", 
      "name": "Marca Ejemplo"
    },
    "inventory": {
      "initialQuantity": 100,
      "availableQuantity": 85
    },
    "images": [
      {
        "url": "https://example.com/image.jpg"
      }
    ]
  }
]
```

#### 2. Obtener Producto por ID
```http
GET /items/{id}
```

**Respuesta**: Objeto de producto individual

#### 3. Buscar Productos
```http
GET /items?query={searchTerm}
```

**Parámetros**:
- `query`: Término de búsqueda

#### 4. Obtener Listas de Precios
```http
GET /price-lists
```

**Respuesta**:
```json
[
  {
    "id": "1",
    "name": "Lista Veterinarios",
    "status": "active",
    "items": [
      {
        "id": "123",
        "price": 12000
      }
    ]
  }
]
```

### Tipos TypeScript

```typescript
interface AlegraProduct {
  id: string
  name: string
  description: string
  reference: string
  price: number
  tax: number
  category: {
    id: string
    name: string
  }
  brand: {
    id: string
    name: string
  }
  inventory: {
    initialQuantity: number
    availableQuantity: number
  }
  images: Array<{
    url: string
  }>
}

interface NormalizedProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  stock: number
  image: string
  reference: string
}
```

### Manejo de Errores

```typescript
try {
  const products = await alegraService.getAllProducts()
} catch (error) {
  if (error.status === 401) {
    console.error('Credenciales de Alegra inválidas')
  } else if (error.status === 429) {
    console.error('Límite de rate limit excedido')
  } else {
    console.error('Error en Alegra API:', error.message)
  }
}
```

## 🔥 Firebase API

### Configuración

**Servicios utilizados**:
- Authentication
- Firestore Database
- Storage (opcional)

### Authentication

#### Inicialización
```javascript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
```

#### Métodos de Autenticación

**Login con Email/Password**:
```javascript
import { signInWithEmailAndPassword } from 'firebase/auth'

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error('Error de login:', error.message)
  }
}
```

**Logout**:
```javascript
import { signOut } from 'firebase/auth'

const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error de logout:', error.message)
  }
}
```

**Observar cambios de autenticación**:
```javascript
import { onAuthStateChanged } from 'firebase/auth'

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Usuario autenticado:', user.uid)
  } else {
    console.log('Usuario no autenticado')
  }
})
```

### Firestore Database

#### Inicialización
```javascript
import { getFirestore } from 'firebase/firestore'

const db = getFirestore(app)
```

#### Operaciones CRUD

**Crear documento**:
```javascript
import { collection, addDoc } from 'firebase/firestore'

const addUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), userData)
    return docRef.id
  } catch (error) {
    console.error('Error creando usuario:', error)
  }
}
```

**Leer documentos**:
```javascript
import { collection, getDocs, query, where } from 'firebase/firestore'

const getUsers = async () => {
  try {
    const q = query(collection(db, 'users'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
  }
}
```

**Actualizar documento**:
```javascript
import { doc, updateDoc } from 'firebase/firestore'

const updateUser = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, userData)
  } catch (error) {
    console.error('Error actualizando usuario:', error)
  }
}
```

### Reglas de Seguridad Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer/escribir
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Reglas específicas para usuarios
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📱 WhatsApp Business API (Opcional)

### Configuración

**Servicio**: `src/services/whatsappService.ts`

### Funcionalidades

#### Envío de Mensajes
```typescript
interface WhatsAppMessage {
  to: string
  message: string
  template?: string
}

const sendMessage = async (message: WhatsAppMessage) => {
  // Implementación específica según proveedor
}
```

#### Plantillas de Mensajes
```typescript
const messageTemplates = {
  cartSummary: (items: CartItem[]) => `
🛒 *Resumen de tu pedido*

${items.map(item => 
  `• ${item.name} x${item.quantity} - $${item.price}`
).join('\n')}

Total: $${items.reduce((sum, item) => sum + item.total, 0)}

¿Confirmas tu pedido?`
}
```

### Integración con Carrito

```typescript
const sendCartToWhatsApp = async (cartItems: CartItem[]) => {
  const message = messageTemplates.cartSummary(cartItems)
  
  try {
    await whatsappService.sendMessage({
      to: '+573001234567',
      message: message
    })
  } catch (error) {
    console.error('Error enviando mensaje:', error)
  }
}
```

## 🔧 Configuración de Variables de Entorno

### Archivo .env
```env
# Alegra API
VITE_ALEGRA_API_KEY=email:token
VITE_ALEGRA_BASE_URL=https://api.alegra.com/api/v1

# Firebase
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123DEF

# WhatsApp (opcional)
VITE_WHATSAPP_API_URL=https://api.whatsapp.com
VITE_WHATSAPP_TOKEN=tu_token_aqui
```

## 🛡️ Seguridad y Mejores Prácticas

### Autenticación
- Usar HTTPS en producción
- Validar tokens en el frontend
- Implementar refresh tokens si es necesario

### Rate Limiting
- Implementar límites de requests
- Manejar errores 429 (Too Many Requests)
- Usar caché para reducir llamadas a API

### Manejo de Errores
```typescript
const handleApiError = (error: any) => {
  switch (error.status) {
    case 401:
      // Credenciales inválidas
      break
    case 403:
      // Sin permisos
      break
    case 429:
      // Rate limit excedido
      break
    case 500:
      // Error del servidor
      break
    default:
      // Error genérico
  }
}
```

### Validación de Datos
```typescript
const validateProduct = (product: any): product is AlegraProduct => {
  return (
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.price === 'number' &&
    product.price >= 0
  )
}
```

## 📊 Monitoreo y Logs

### Logging de API Calls
```typescript
const logApiCall = (endpoint: string, method: string, duration: number) => {
  console.log(`API Call: ${method} ${endpoint} - ${duration}ms`)
}
```

### Métricas de Performance
- Tiempo de respuesta de APIs
- Tasa de errores
- Uso de caché

## 🔄 Testing de APIs

### Mock de Servicios
```typescript
// __mocks__/alegraService.ts
export const mockAlegraService = {
  getAllProducts: jest.fn().mockResolvedValue(mockProducts),
  getProductById: jest.fn().mockResolvedValue(mockProduct)
}
```

### Tests de Integración
```typescript
describe('AlegraService', () => {
  it('should fetch products successfully', async () => {
    const products = await alegraService.getAllProducts()
    expect(products).toHaveLength(10)
    expect(products[0]).toHaveProperty('id')
  })
})
```

---

Para más detalles sobre implementación específica, consulta la [Documentación Técnica](TECHNICAL.md).
