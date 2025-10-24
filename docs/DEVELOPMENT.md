# 👨‍💻 Guía de Desarrollo - Catálogo Veterinario Alegra

Esta guía establece las convenciones, mejores prácticas y flujo de trabajo para el desarrollo del proyecto.

## 🎯 Convenciones de Código

### Naming Conventions

#### Archivos y Carpetas
- **Componentes**: PascalCase (`ProductCard.jsx`, `CartSidebar.jsx`)
- **Servicios**: camelCase (`alegraService.ts`, `cacheService.js`)
- **Utilidades**: camelCase (`configFileManager.js`)
- **Páginas**: PascalCase (`HomePage.jsx`, `AdminPage.jsx`)
- **Contextos**: PascalCase (`AuthContext.tsx`, `CartContext.tsx`)

#### Variables y Funciones
```javascript
// ✅ Correcto
const productList = []
const getUserData = () => {}
const isAuthenticated = true

// ❌ Incorrecto
const product_list = []
const GetUserData = () => {}
const IsAuthenticated = true
```

#### Constantes
```javascript
// ✅ Correcto
const API_BASE_URL = 'https://api.alegra.com'
const MAX_PRODUCTS_PER_PAGE = 30

// ❌ Incorrecto
const apiBaseUrl = 'https://api.alegra.com'
const maxProductsPerPage = 30
```

### Estructura de Componentes

#### Componente Funcional con Hooks
```jsx
import React, { useState, useEffect } from 'react'

const ProductCard = ({ product, onAddToCart }) => {
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    // Efectos secundarios
  }, [])
  
  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      await onAddToCart(product)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="product-card">
      {/* JSX content */}
    </div>
  )
}

export default ProductCard
```

#### Props Interface (TypeScript)
```typescript
interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => Promise<void>
  showAddButton?: boolean
  className?: string
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  showAddButton = true,
  className = ''
}) => {
  // Component implementation
}
```

### Estructura de Servicios

#### Clase de Servicio
```typescript
class AlegraService {
  private baseURL: string
  private apiKey: string
  private headers: Record<string, string>

  constructor() {
    this.baseURL = config.alegra.baseURL
    this.apiKey = config.alegra.apiKey
    this.headers = {
      'Authorization': `Basic ${btoa(this.apiKey + ':')}`,
      'Content-Type': 'application/json'
    }
  }

  async getAllProducts(): Promise<NormalizedProduct[]> {
    try {
      // Implementation
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }
}

export default new AlegraService()
```

## 🧪 Testing

### Estructura de Tests

#### Test de Componente
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '../ProductCard'

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 1000,
    // ... other properties
  }

  const mockOnAddToCart = jest.fn()

  beforeEach(() => {
    mockOnAddToCart.mockClear()
  })

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$1,000')).toBeInTheDocument()
  })

  it('calls onAddToCart when add button is clicked', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />)
    
    const addButton = screen.getByRole('button', { name: /agregar al carrito/i })
    fireEvent.click(addButton)
    
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct)
  })
})
```

#### Test de Servicio
```typescript
import alegraService from '../alegraService'

// Mock fetch
global.fetch = jest.fn()

describe('AlegraService', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('fetches products successfully', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 1000 }
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts
    })

    const products = await alegraService.getAllProducts()
    
    expect(products).toEqual(mockProducts)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/items'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': expect.stringContaining('Basic')
        })
      })
    )
  })
})
```

### Coverage Goals
- **Statements**: > 80%
- **Branches**: > 70%
- **Functions**: > 80%
- **Lines**: > 80%

## 🔄 Git Workflow

### Branching Strategy

#### Ramas Principales
- `main`: Rama de producción estable
- `develop`: Rama de desarrollo (opcional)
- `feature/*`: Nuevas funcionalidades
- `bugfix/*`: Corrección de bugs
- `hotfix/*`: Fixes críticos para producción

#### Naming de Branches
```bash
# Features
feature/user-authentication
feature/cart-functionality
feature/product-filters

# Bugfixes
bugfix/cart-calculation-error
bugfix/login-redirect-issue

# Hotfixes
hotfix/security-patch
hotfix/critical-api-fix
```

### Commit Messages

#### Formato
```
type(scope): description

[optional body]

[optional footer]
```

#### Tipos
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan lógica)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Cambios en build, dependencias, etc.

#### Ejemplos
```bash
feat(cart): add product quantity validation
fix(auth): resolve login redirect issue
docs(api): update Alegra API documentation
refactor(services): improve error handling in AlegraService
test(components): add ProductCard component tests
```

### Pull Request Process

#### Checklist antes de PR
- [ ] Tests pasan (`npm test`)
- [ ] Linting pasa (`npm run lint`)
- [ ] Build exitoso (`npm run build`)
- [ ] Documentación actualizada
- [ ] Commits con mensajes descriptivos

#### Template de PR
```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Testing
- [ ] Tests unitarios agregados/actualizados
- [ ] Tests de integración ejecutados
- [ ] Manual testing realizado

## Screenshots (si aplica)
[Agregar capturas de pantalla]

## Checklist
- [ ] Código sigue las convenciones del proyecto
- [ ] Self-review completado
- [ ] Documentación actualizada
```

## 🛠️ Herramientas de Desarrollo

### ESLint Configuration
```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'prefer-const': 'error'
    }
  }
]
```

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

## 📦 Gestión de Dependencias

### Agregar Dependencias
```bash
# Dependencia de producción
npm install package-name

# Dependencia de desarrollo
npm install --save-dev package-name

# Dependencia opcional
npm install --save-optional package-name
```

### Actualizar Dependencias
```bash
# Verificar dependencias desactualizadas
npm outdated

# Actualizar dependencias menores
npm update

# Actualizar dependencias mayores (cuidado)
npm install package-name@latest
```

### Auditoría de Seguridad
```bash
# Verificar vulnerabilidades
npm audit

# Corregir automáticamente
npm audit fix

# Corregir con breaking changes
npm audit fix --force
```

## 🚀 Deployment

### Build de Producción
```bash
# Build optimizado
npm run build

# Preview del build
npm run preview

# Análisis del bundle
npm run analyze
```

### Variables de Entorno de Producción
```env
# Producción
NODE_ENV=production
VITE_ALEGRA_API_KEY=prod_api_key
VITE_FIREBASE_PROJECT_ID=prod_project_id
```

### Checklist de Deployment
- [ ] Tests pasan en CI/CD
- [ ] Build exitoso
- [ ] Variables de entorno configuradas
- [ ] Firebase rules actualizadas
- [ ] Backup de base de datos (si aplica)
- [ ] Monitoreo configurado

## 🐛 Debugging

### Herramientas de Debug
```javascript
// Console logging con niveles
console.log('🔍 Debug info:', data)
console.warn('⚠️ Warning:', warning)
console.error('❌ Error:', error)

// Debug condicional
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

### React DevTools
- Instalar extensión del navegador
- Usar Profiler para performance
- Inspeccionar Context y State

### Network Debugging
```javascript
// Interceptar requests
const originalFetch = window.fetch
window.fetch = async (...args) => {
  console.log('API Call:', args[0])
  const response = await originalFetch(...args)
  console.log('API Response:', response.status)
  return response
}
```

## 📊 Performance

### Optimizaciones React
```jsx
// Memoización de componentes
const ProductCard = React.memo(({ product }) => {
  // Component implementation
})

// Memoización de callbacks
const handleAddToCart = useCallback((product) => {
  // Handler implementation
}, [dependencies])

// Memoización de valores computados
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])
```

### Bundle Optimization
```javascript
// Lazy loading de rutas
const AdminPage = React.lazy(() => import('./pages/AdminPage'))

// Code splitting manual
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))
```

## 🔒 Seguridad

### Mejores Prácticas
- Validar todas las entradas del usuario
- Sanitizar datos antes de mostrar
- Usar HTTPS en producción
- Implementar CSP headers
- Validar tokens de autenticación

### Secrets Management
```javascript
// ❌ Nunca hacer esto
const apiKey = 'hardcoded-key'

// ✅ Usar variables de entorno
const apiKey = import.meta.env.VITE_API_KEY
```

---

Para más detalles técnicos, consulta la [Documentación Técnica](TECHNICAL.md).
