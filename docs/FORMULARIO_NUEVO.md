# 📝 Nuevo Formulario de Comunicaciones

## 🎯 Estructura Propuesta

El formulario debe tener **3 secciones claramente definidas**:

### Sección 1: Seleccionar Tipo (Primero)
```
🎯 Tipo de Comunicación
┌──────────────────────┬──────────────────────┬──────────────────────┐
│  Anuncio Público     │    Promoción         │  Descuento Exclusivo │
│  Páginas principales │  Portal clientes     │  Clientes específicos│
└──────────────────────┴──────────────────────┴──────────────────────┘
```

### Sección 2: Campos Comunes (Siempre)
- Título *
- Subtítulo
- Descripción
- Badge (NUEVO, IMPORTANTE, etc.)
- Tipo (producto-nuevo, promocion, etc.)
- Imagen (opcional)
- Botón (texto y enlace)
- Fechas (válido desde/hasta)

### Sección 3: Campos Específicos (Condicionales)

#### Si es "Anuncio Público":
```
📢 Configuración de Anuncio Público
Este anuncio se mostrará en las páginas principales

- Sección: [Veterinarios] [Pet Shops] [Ambas]
```

#### Si es "Promoción":
```
🎉 Configuración de Promoción
Esta promoción se mostrará a los clientes registrados

- Sección: [Veterinarios] [Pet Shops] [Ambas]
- Porcentaje de descuento: [15] %
```

#### Si es "Descuento Exclusivo":
```
🎁 Configuración Prix Descuento Exclusivo
Esta promoción se mostrará solo a los clientes seleccionados

- Porcentaje de descuento: [20] %
- Seleccionar clientes específicos:
  🔍 Buscar: [_________________]
  ☑ Cliente 1
  ☑ Cliente 2
  ☑ Cliente 3
```

## 🔄 Flujo del Usuario

1. **Usuario selecciona tipo** → Se desbloquean campos específicos
2. **Usuario llena campos comunes** → Título, subtítulo, etc.
3. **Usuario llena campos específicos** → Según el tipo seleccionado
4. **Usuario guarda** → Se crea el comunicado

## 📊 Ventajas

✅ Más claro y organizado
✅ Menos confusión sobre qué campos llenar
✅ Interface más limpia
✅ Validación más simple

## 🚧 Estado Actual

El formulario actual tiene:
- ✅ Radio buttons para seleccionar tipo
- ⚠️ Campos mezclados sin organización clara
- ❌ Faltan secciones visuales separadas
- ❌ No hay mensajes explicativos por tipo

## 🎯 Próximos Pasos

1. Reorganizar el JSX del formulario
2. Separar campos comunes de específicos
3. Agregar mensajes explicativos
4. Mejorar UX visual

