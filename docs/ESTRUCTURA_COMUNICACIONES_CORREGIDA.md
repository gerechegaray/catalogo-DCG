# 📢 Estructura Corregida de Comunicaciones

## 🎯 Tipos de Comunicaciones

Se han redefinido los tipos de comunicaciones para que sean más claros y específicos:

### 1. **Anuncio Público** (`communicationType: 'anuncio'`)
- **Dónde se muestra:** Páginas principales del catálogo (Veterinarios y Pet Shops)
- **Para quién:** Todos los visitantes (público en general)
- **Propósito:** Comunicar novedades, nuevos productos, avisos generales
- **Características:**
  - Se filtra por `section` (veterinarios/petshops/ambos)
  - NO tiene descuento
  - NO tiene clientes específicos
  - Ejemplo: "NUEVA LÍNEA DE VACUNAS", "AUMENTO DE PRECIOS"

### 2. **Promoción** (`communicationType: 'promocion'`)
- **Dónde se muestra:** Portal de Clientes (solo usuarios registrados)
- **Para quién:** Todos los clientes de un tipo específico (vet o pet)
- **Propósito:** Ofertas y descuentos para clientes registrados
- **Características:**
  - Se filtra por `section` (veterinarios/petshops)
  - SÍ tiene porcentaje de descuento
  - NO tiene clientes específicos
  - Ejemplo: "15% OFF EN ENERO" para veterinarios

### 3. **Descuento Exclusivo** (`communicationType: 'descuento-exclusivo'`)
- **Dónde se muestra:** Portal de Clientes (solo usuarios registrados)
- **Para quién:** Clientes específicos seleccionados uno por uno
- **Propósito:** Descuentos personalizados para clientes fieles o especiales
- **Características:**
  - SÍ tiene porcentaje de descuento
  - SÍ tiene clientes específicos (`targetClients`)
  - Ejemplo: "20% OFF Exclusivo" solo para el cliente XYZ

## 📊 Flujo de Visualización

```
┌─────────────────────────────────────────────────────────────┐
│  PÁGINAS PÚBLICAS                                           │
│  (Veterinarios / Pet Shops)                                 │
├─────────────────────────────────────────────────────────────┤
│  ✅ Anuncios Públicos                                       │
│  ❌ NO se muestran Promociones                              │
│  ❌ NO se muestran Descuentos Exclusivos                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PORTAL DE CLIENTES                                         │
│  (/client/dashboard, /client/promotions)                    │
├─────────────────────────────────────────────────────────────┤
│  ✅ Promociones (filtradas por tipo: vet/pet)              │
│  ✅ Descuentos Exclusivos (filtrados por cliente)          │
│  ❌ NO se muestran Anuncios Públicos                        │
└─────────────────────────────────────────────────────────────┘
```

## 💾 Estructura en Firestore

### Anuncio Público
```json
{
  "title": "Nueva Línea de Vacunas",
  "subtitle": "Disponibles ahora",
  "type": "producto-nuevo",
  "communicationType": "anuncio",
  "section": "veterinarios",
  "targetClients": [],
  "discountPercent": "",
  "badge": "NUEVO",
  "image": "https://...",
  "active": true,
  "validFrom": "2025-01-15",
  "validUntil": "2025-12-31"
}
```

### Promoción
```json
{
  "title": "15% OFF en Enero",
  "subtitle": "Válido hasta el 31/01",
  "type": "promocion",
  "communicationType": "promocion",
  "section": "veterinarios",
  "targetClients": [],
  "discountPercent": "15",
  "badge": "PROMO",
  "image": "https://...",
  "active": true,
  "validFrom": "2025-01-01",
  "validUntil": "2025-01-31"
}
```

### Descuento Exclusivo
```json
{
  "title": "20% OFF Exclusivo",
  "subtitle": "Descuento especial",
  "type": "descuento-exclusivo",
  "communicationType": "descuento-exclusivo",
  "section": "veterinarios",
  "targetClients": ["clienteId1", "clienteId2"],
  "discountPercent": "20",
  "badge": "EXCLUSIVO",
  "image": "https://...",
  "active": true,
  "validFrom": "2025-01-01",
  "validUntil": "2025-01-31"
}
```

## 🔧 Integración con el Código

### En empresa CommunicationsManager
- Los 3 tipos se seleccionan con radio buttons
- El campo `discountPercent` solo aparece para Promoción y Descuento Exclusivo
- El selector de clientes solo aparece para Descuento Exclusivo

### En el Portal de Clientes (ClientPromotionsPage)
- Solo se obtienen comunicaciones con `communicationType === 'promocion'` o `'descuento-exclusivo'`
- Se filtran por `targetClients` para exclusivos
- Se filtran por `section` para promociones

### En las Páginas Públicas (Veterinarios/Pet Shops)
- Solo se obtienen comunicaciones con `communicationType === 'anuncio'`
- Se filtran por `section`

## ✅ Ejemplos de Uso

### Ejemplo 1: Anuncio Público
**Objetivo:** Comunicar ""a todos los veterinarios que hay una nueva línea de vacunas""

1. Seleccionar "Anuncio Público"
2. Llenar título, subtítulo, imagen
3. Section: "Veterinarios"
4. NO se llena descuento ni clientes
5. Guardar
→ **Resultado:** Aparece en la página principal de Veterinarios

### Ejemplo 2: Promoción
**Objetivo:** "15% de descuento en enero para todos los veterinarios registrados"

1. Seleccionar "Promoción"
2. Llenar título: "15% OFF Enero"
3. Descuento: 15%
4. Section: "Veterinarios"
5. Guardar
→ **Resultado:** Solo los veterinarios registrados lo ven en su portal

### Ejemplo 3: Descuento Exclusivo
**Objetivo:** "20% de descuento exclusivo para el cliente Bermúdez"

1. Seleccionar "Descuento Exclusivo"
2. Llenar título: "20% OFF Exclusivo"
3. Descuento: 20%
4. Buscar y seleccionar "Bermúdez Raúl"
5. Guardar
→ **Resultado:** Solo Bermúdez lo ve en su portal

## 🎨 UI/UX

### En el Admin (CommunicationsManager)
```
🎯 Tipo de Comunicación
┌─────────────────┬─────────────────┬──────────────────┐
│ Anuncio Público │   Promoción     │ Descuento Exc.   │
│ Páginas princ.  │ Portal clientes │ Clientes espec.  │
└─────────────────┴─────────────────┴──────────────────┘
```

### En el Portal de Clientes
- Las promociones se muestran con su badge y % de descuento
- Los descuentos exclusivos tienen prioridad visual (aparecen primero)
- Filtros: "Todas", "Promociones", "Descuentos"

