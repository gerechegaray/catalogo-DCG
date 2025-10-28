# 🎯 Estructura de Promociones para Portal de Clientes

## Propuesta de Implementación

### 1. Estructura de Datos en Firestore

**Colección: `communications`** (extensión existente)

```typescript
{
  // Campos existentes
  title: string
  subtitle?: string
  description?: string
  image: string
  buttonText?: string
  buttonLink?: string
  badge?: string // 'NUEVO', 'LIMITADO', 'EXCLUSIVO', etc.
  section: string // 'veterinarios', 'petshops', 'ambos'
  type: string // 'anuncio', 'promocion', 'descuento', 'producto-nuevo'
  active: boolean
  validFrom: string (YYYY-MM-DD)
  validUntil: string (YYYY-MM-DD)
  
  // NUEVOS campos para Portal de Clientes
  targetClients?: string[] // IDs de clientes específicos (opcional)
  discountPercent?: number // Porcentaje de descuento (ej: 15 para 15%)
  isExclusiveClient?: boolean // true = solo clientes específicos
  
  // Metadata
  createdAt: string
  updatedAt: string
}
```

### 2. Tipos de Comunicaciones

#### A) **Anuncios Generales**
- Se muestran a **todos los clientes** de un tipo (vet/pet)
- Ejemplo: "Nueva línea de productos disponible"
- Campos: `section`, NO `targetClients`

#### B) **Promociones por Tiempo Limitado**
- Con vigencia (`validFrom` y `validUntil`)
- Se muestran según el tipo de cliente
- Ejemplo: "20% OFF hasta el 31 de diciembre"
- Campos: `section`, `discountPercent`, `validFrom`, `validUntil`

#### C) **Descuentos Exclusivos por Cliente**
- Solo para clientes específicos
- Creados por admin para un cliente en particular
- Ejemplo: "Descuento especial personalizado"
- Campos: `targetClients` (array de IDs), `discountPercent`, `isExclusiveClient: true`

### 3. Gestión desde AdminPage

**Flujo de creación:**

```
1. Admin selecciona tipo:
   - Anuncio General (para todos)
   - Promoción con Descuento (con o sin vigencia)
   - Descuento Exclusivo (para clientes específicos)

2. Si es "Descuento Exclusivo":
   - Mostrar selector de clientes (multiselect)
   - Campo para porcentaje de descuento

3. Configurar:
   - Título, descripción, imagen
   - Vigencia (validFrom/validUntil)
   - Badge (NUEVO, LIMITADO, EXCLUSIVO)

4. Guardar
```

### 4. Visualización en Portal de Clientes

**En Dashboard:**
- Muestra hasta 2 promociones destacadas
- Filtradas por cliente y tipo

**En `/client/promotions`:**
- Todos los comunicados relevantes
- Filtros por tipo: Anuncios, Promociones, Descuentos
- Orden Prestablecido:
  1. Descuentos exclusivos del cliente (destacados)
  2. Promociones vigentes
  3. Anuncios generales

### 5. Ventajas de esta Estructura

✅ **Flexible:** Un solo campo `type` cubre todos los casos
✅ **Escalable:** Fácil agregar nuevos tipos
✅ **Administrable:** Admin puede crear promociones específicas fácilmente
✅ **Performance:** Filtrado eficiente en frontend
✅ **Extensible:** Fácil agregar más campos (ej: códigos de descuento)

### 6. Implementación Sugerida

#### Paso 1: Extender CommunicationsManager
- Agregar campo `discountPercent`
- Agregar selector de clientes (multiselect)
- Agregar toggle "Es exclusivo"

#### Paso 2: Actualizar ClientPromotionsPage
- Mejorar visualización de descuentos
- Destacar promociones exclusivas
- Mostrar badge de porcentaje

#### Paso 3: Testing
- Probar con diferentes tipos
- Verificar filtrado correcto

---

## Decisión

**¿Te parece bien esta estructura?** 

Si estás de acuerdo, procedo a:
1. Modificar CommunicationsManager para soportar esta estructura
2. Mejorar la visualización en ClientPromotionsPage
3. Agregar selector de clientes en el admin

**¿Algún ajuste o duda?**

