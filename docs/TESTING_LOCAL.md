# 🧪 Guía de Testing Local

## 🎯 Objetivo

Probar la nueva arquitectura con Firebase Storage **sin necesidad de desplegar Cloud Functions** todavía.

## 📋 Opción 1: Probar con Fallback (Rápido)

### Paso 1: Ejecutar el Frontend

```bash
npm run dev
```

### Paso 2: Ver en Consola

1. Abre el navegador
2. Presiona F12 (consola)
3. Verás estos mensajes:
   ```
   📥 Descargando catálogo vet desde Storage...
   ⚠️ Archivo no encontrado, intentando fallback...
   🔄 Intentando fallback con Firestore...
   📖 Cargando productos desde cache...
   ```

✅ **¿Qué estás probando?**
- Que el código híbrido funciona
- Que el fallback a Firestore es transparente
- Que no hay errores en el flujo

❌ **Lo que falta**: Los ahorros reales de Storage

---

## 📁 Opción 2: Crear JSON Manuales en Storage

### Paso 1: Preparar Archivo JSON de Prueba

Crea un archivo `test-catalog.json` con este contenido (ejemplo para 5 productos):

```json
[
  {
    "id": "1",
    "name": "Vacuna Antirrábica",
    "description": "Profilaxis canina y felina",
    "price": 45000,
    "stock": 150,
    "category": "Vacunas",
    "subcategory": "Antirrábica",
    "supplier": "Laboratorio Vet",
    "userType": "vet",
    "image": "",
    "code": "VAC-001",
    "unit": "dosis",
    "status": "active"
  },
  {
    "id": "2",
    "name": "Antipulgas Premium",
    "description": "Control de parásitos externos",
    "price": 35000,
    "stock": 200,
    "category": "Medicamentos",
    "subcategory": "Antiparasitarios",
    "supplier": "Pet Care Labs",
    "userType": "pet",
    "image": "",
    "code": "APF-002",
    "unit": "unidad",
    "status": "active"
  },
  {
    "id": "3",
    "name": "Alimento Balanceado Premium",
    "description": "Para perros adultos",
    "price": 85000,
    "stock": 80,
    "category": "Alimentos",
    "subcategory": "Balanceado",
    "supplier": "Pet Nutrition",
    "userType": "pet",
    "image": "",
    "code": "ALI-003",
    "unit": "bolsa",
    "status": "active"
  },
  {
    "id": "4",
    "name": "Desinfectante Clínico",
    "description": "Para superficies e instrumental",
    "price": 25000,
    "stock": 120,
    "category": "Equipos",
    "subcategory": "Desinfección",
    "supplier": "Vet Supplies",
    "userType": "vet",
    "image": "",
    "code": "DES-004",
    "unit": "litro",
    "status": "active"
  },
  {
    "id": "5",
    "name": "Juguete Pelota Resistente",
    "description": "Para perros activos",
    "price": 15000,
    "stock": 200,
    "category": "Juguetes",
    "subcategory": "Pelotas",
    "supplier": "Pet Toys Inc",
    "userType": "pet",
    "image": "",
    "code": "JUG-005",
    "unit": "unidad",
    "status": "active"
  }
]
```

### Paso 2: Subir a Firebase Storage

#### Opción A: Desde Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Storage** en el menú lateral
4. Click en **Get Started** si es la primera vez
5. Click en el botón **Upload file**
6. Sube el archivo renombrado como `veterinarios.json`
7. Colócalo en la carpeta `catalog/` (o crea la carpeta primero)
8. Repite el proceso para `petshops.json` (puede ser el mismo archivo por ahora)

#### Opción B: Usando Firebase CLI

```bash
# Si tienes instalado firebase CLI
firebase login
firebase init storage

# Subir archivos
gsutil cp test-catalog.json gs://catalogo-veterinaria-alegra.firebasestorage.app/catalog/veterinarios.json
gsutil cp test-catalog.json gs://catalogo-veterinaria-alegra.firebasestorage.app/catalog/petshops.json
```

### Paso 3: Probar en el Frontend

```bash
npm run dev
```

Ahora en la consola verás:
```
📥 Descargando catálogo vet desde Storage...
✅ Catálogo vet descargado: 5 productos
```

✅ **¿Qué estás probando?**
- Descarga desde Storage
- Cache en memoria
- Integración completa
- Los 5 productos se muestran en la UI

---

## 🧪 Opción 3: Usar Firebase Emulators (Completo)

### Paso 1: Instalar Firebase Emulator

```bash
npm install -g firebase-tools
firebase init emulators
# Selecciona: Storage, Functions
```

### Paso 2: Configurar Emulators

Crea/edita `firebase.json`:

```json
{
  "emulators": {
    "functions": {
      "port": 5001
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

### Paso 3: Actualizar Configuración de Firebase

En `src/config/firebase.js`, agrega configuración para emuladores:

```javascript
import { connectStorageEmulator } from 'firebase/storage'

// ... código existente ...

// En desarrollo, usar emuladores
if (import.meta.env.DEV) {
  try {
    connectStorageEmulator(storage, "localhost", 9199)
  } catch (error) {
    // Ya conectado
  }
}
```

### Paso 4: Ejecutar Todo

```bash
# Terminal 1: Emuladores
firebase emulators:start

# Terminal 2: Frontend
npm run dev
```

### Paso 5: Cargar Datos en Emulator

Usa la UI de emuladores en `http://localhost:4000` para subir archivos JSON manualmente.

---

## 🎯 Qué Probar en Cada Opción

### Checklist de Testing:

- [ ] El frontend carga sin errores
- [ ] Los productos se muestran correctamente
- [ ] Los filtros funcionan
- [ ] El carrito funciona
- [ ] Los analytics siguen grabando en Firestore
- [ ] La consola muestra los mensajes esperados
- [ ] No hay errores 404 o 500

### En la Consola Deberías Ver:

**Con Fallback (sin Storage)**:
```
📥 Descargando catálogo vet desde Storage...
❌ Error descargando catálogo vet: ...
⚠️ Archivo no encontrado, intentando fallback...
🔄 Intentando fallback con Firestore...
✅ Usando Storage como fuente principal
```

**Con Storage (JSON manuales)**:
```
📥 Descargando catálogo vet desde Storage...
✅ Catálogo vet descargado: 5 productos
```

---

## 🐛 Troubleshooting Local

### Error: "storage/object-not-found"

✅ **Es esperado si no subiste los JSON** - Usará Firestore como fallback

### Los productos no se muestran

1. Verifica que existan productos en Firestore o en Storage
2. Revisa la consola del navegador
3. Verifica que `userType` coincida

### Error de CORS

Si estás usando Storage local, agrega reglas en `firebase.json`:

```json
{
  "storage": {
    "rules": "storage.rules"
  }
}
```

Y en `storage.rules`:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## 🚀 Próximos Pasos Después del Testing

Una vez que pruebes localmente y todo funcione:

1. ✅ Desplegar Cloud Function
2. ✅ Configurar Cloud Scheduler
3. ✅ Ejecutar función manualmente primera vez
4. ✅ Monitorear producción
5. ✅ Verificar que los ahorros se cumplan

---

**Recomendación**: Empieza con la **Opción 1** para verificar que el código funciona, luego prueba **Opción 2** para ver la integración completa con Storage.

