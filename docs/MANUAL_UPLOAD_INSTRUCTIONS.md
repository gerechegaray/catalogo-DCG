# 📤 Instrucciones para Subir Archivos JSON Manualmente

## 🔧 Problema

El script `upload:test` requiere autenticación de Firebase Admin. Para testing local, es más simple subir manualmente.

## ✅ Solución Rápida: Subir desde Firebase Console

### Paso 1: Preparar el archivo JSON

Crea un archivo llamado `test-catalog.json` con este contenido:

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

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `catalogo-veterinaria-alegra`
3. En el menú lateral, click en **Storage**
4. Si es la primera vez, click en **Get Started**
5. Configura las reglas de Storage como públicas temporalmente:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if true;
       }
     }
   }
   ```
6. Click en **Upload file**
7. Sube el archivo como `veterinarios.json`
8. Si te pide carpeta, crea `catalog/` primero
9. Repite con el mismo archivo como `petshops.json` en la misma carpeta

### Paso 3: Verificar

En la estructura de Storage deberías ver:
```
catalog/
  Vital veterinarios.json
  Vital petshops.json
```

## 🎯 Alternativa: Usar Firestore (MÁS SIMPLE)

Para testing rápido, puedes simplemente:

1. Ejecutar `npm run dev`
2. El sistema usará Firestore automáticamente como fallback
3. Verás en la consola: `⚠️ Archivo no encontrado, usando Firestore`

Esto prueba que:
- ✅ El código híbrido funciona
- ✅ El fallback es transparente
- ✅ No hay errores

## 🚀 Resultado Esperado

Después de subir los JSON y ejecutar `npm run dev`:

**En la consola del navegador (F12)**:
```
📥 Descargando catálogo vet desde Storage...
✅ Catálogo vet descargado: 5 productos
```

**En la UI**:
- Verás 5 productos de prueba
- Podrás filtrar y buscar
- El carrito funcionará

## ⚠️ Importante

Estos archivos JSON son **SOLO PARA TESTING**. 

En producción, la Cloud Function generará estos archivos automáticamente cada día desde la API de Alegra.

---

¿Problemas? Consulta `docs/DEPLOYMENT.md`

