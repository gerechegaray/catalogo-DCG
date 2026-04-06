# 📋 Guía de Manejo de Errores y Notificaciones

## 🎯 Sistema Implementado

Se ha implementado un sistema completo de manejo de errores que incluye:

1. **Error Boundary**: Captura errores de React y muestra pantallas amigables
2. **Sistema de Notificaciones Toast**: Reemplaza `alert()` con notificaciones elegantes
3. **Error Handler Centralizado**: Logging y mensajes de error consistentes

---

## 🚀 Cómo Usar

### 1. Notificaciones Toast

#### En cualquier componente:

```tsx
import { useToast } from '../context/ToastContext'

const MiComponente = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast()

  const handleAction = async () => {
    try {
      // Tu código aquí
      await algunaOperacion()
      showSuccess('✅ Operación exitosa')
    } catch (error) {
      showError('❌ Error al realizar la operación')
    }
  }
}
```

#### Tipos de notificaciones:

- `showSuccess(message, duration?)` - Éxito (verde)
- `showError(message, duration?)` - Error (rojo, dura 7s por defecto)
- `showWarning(message, duration?)` - Advertencia (amarillo)
- `showInfo(message, duration?)` - Información (azul)

### 2. Manejo de Errores con Contexto

```tsx
import { handleError } from '../utils/errorHandler'
import { useToast } from '../context/ToastContext'

const MiComponente = () => {
  const { showError } = useToast()

  const handleAction = async () => {
    try {
      await algunaOperacion()
    } catch (error) {
      const errorMessage = handleError(error, {
        component: 'MiComponente',
        action: 'handleAction',
        additionalData: { userId: '123' }
      })
      showError(errorMessage)
    }
  }
}
```

### 3. Error Boundary

El Error Boundary está integrado globalmente en `App.jsx`. Captura automáticamente:

- Errores de renderizado de componentes
- Errores en el ciclo de vida de componentes
- Errores en constructores de componentes

**No captura:**
- Errores en event handlers (usa try-catch)
- Errores en código asíncrono (usa try-catch)
- Errores durante el renderizado del servidor

---

## 📝 Ejemplos de Migración

### Antes (con alert):

```tsx
try {
  await saveData()
  alert('✅ Datos guardados')
} catch (error) {
  alert('❌ Error: ' + error.message)
}
```

### Después (con toast):

```tsx
import { useToast } from '../context/ToastContext'
import { handleError } from '../utils/errorHandler'

const { showSuccess, showError } = useToast()

try {
  await saveData()
  showSuccess('✅ Datos guardados')
} catch (error) {
  const errorMessage = handleError(error, {
    component: 'MiComponente',
    action: 'saveData'
  })
  showError(errorMessage)
}
```

---

## 🔧 Mejores Prácticas

### 1. Siempre usa try-catch en operaciones asíncronas

```tsx
const handleSubmit = async () => {
  try {
    await submitForm()
    showSuccess('Formulario enviado')
  } catch (error) {
    showError(handleError(error, { component: 'Form', action: 'submit' }))
  }
}
```

### 2. Proporciona contexto útil

```tsx
handleError(error, {
  component: 'ProductCard',
  action: 'addToCart',
  userId: currentUser?.id,
  additionalData: { productId: product.id }
})
```

### 3. Usa el tipo de notificación correcto

- **Success**: Operaciones exitosas
- **Error**: Errores que impiden la operación
- **Warning**: Advertencias (ej: "El carrito está vacío")
- **Info**: Información general

### 4. No abuses de las notificaciones

- No muestres notificaciones para acciones menores
- Agrupa múltiples errores en un solo mensaje cuando sea posible
- Usa duraciones apropiadas (errores más tiempo, success menos)

---

## 🐛 Debugging

### En desarrollo:

El Error Boundary muestra información detallada del error:
- Mensaje del error
- Stack trace completo
- Componente donde ocurrió

### Logging automático:

Todos los errores se loggean automáticamente en la consola con:
- Timestamp
- Mensaje del error
- Stack trace
- Contexto proporcionado
- URL y user agent

---

## 📦 Componentes Actualizados

Los siguientes componentes ya usan el nuevo sistema:

- ✅ `BrandManager` - Gestión de marcas
- ✅ `CartSidebar` - Carrito de compras
- ✅ `App.jsx` - Error Boundary global

### Pendientes de actualizar:

- `AdminPage` - Panel de administración
- `CommunicationsManager` - Gestión de comunicaciones
- `ProductDetailPage` - Detalle de producto
- Otros componentes con `alert()` o `console.error()`

---

## 🎨 Personalización

### Cambiar duración de notificaciones:

```tsx
showSuccess('Mensaje', 3000) // 3 segundos
showError('Error', 10000) // 10 segundos
showInfo('Info', 0) // No se cierra automáticamente
```

### Estilos de Toast:

Los estilos están en `src/components/Toast.tsx` y usan Tailwind CSS. Puedes personalizar:
- Colores por tipo
- Tamaño y posición
- Animaciones
- Iconos

---

## 🔒 Seguridad

- Los errores en producción NO muestran stack traces
- Los mensajes de error son amigables para usuarios
- El logging detallado solo ocurre en desarrollo
- No se exponen datos sensibles en mensajes de error

---

## 📚 Referencias

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Error Handling Best Practices](https://kentcdodds.com/blog/get-a-catch-block-error-message)



