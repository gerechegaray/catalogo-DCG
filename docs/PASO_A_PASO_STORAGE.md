# 🎯 Configuración Paso a Paso: Firebase Storage

## 📍 PASO 1: Habilitar Firebase Storage

### Ve a Firebase Console:
👉 [https://console.firebase.google.com/](https://console.firebase.google.com/)

1. Selecciona tu proyecto: **catalogo-veterinaria-alegra**
2. En el menú lateral izquierdo, busca: **Storage** 📦
3. Click en **Storage**

### Si es la primera vez:
4. Click en **Get Started** o **Comenzar**
5. Te dará 2 opciones:

#### **Opción A: Test Mode (Más Fácil - 30 días)**
- ✅ **Permite acceso sin autenticación**
- ✅ **Perfecto para desarrollo rápido**
- ⚠️ **Expira en 30 días** (después debes configurar reglas)
- 💡 **Recomendado si: Quieres empezar YA sin configurar nada**

#### **Opción B: Production Mode (Recomendado)**
- ✅ **No expira nunca**
- ✅ **Más seguro**
- ✅ **Mejores prácticas**
- ⚠️ **Requiere configurar reglas** (5 minutos)
- 💡 **Recomendado si: Ya seguiste los pasos de reglas**

**Para desarrollo, cualquier opción funciona. Elige la que prefieras.**

6. Click **Next** (Siguiente)
7. Ubicación: deja la por defecto
8. Click **Done** (Listo)

✅ **Storage ahora está habilitado**

---

## 📍 PASO 2: Configurar Reglas de Storage

⏭️ **SI ELEGISTE "Test Mode"**: Salta este paso (pero vuelve en 30 días)  
✅ **SI ELEGISTE "Production Mode"**: Continúa aquí

Seguimos en Firebase Console → **Storage**:

1. Click en la pestaña **"Rules"** (Reglas) en la parte superior
2. Verás un editor de texto con código

3. **Borra todo** y pega esto:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública de catálogos JSON
    match /catalog/{fileName} {
      allow read: if true;
      allow write: if false;
    }
    
    // Resto de archivos necesita autenticación
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Click en **Publish** (Publicar) arriba a la derecha
5. Espera confirmación: "Rules published successfully"

✅ **Reglas configuradas**

---

## 📍 PASO 3: Crear Carpeta "catalog"

Seguimos en **Storage** → pestaña **"Files"**:

1. Click en **"Create folder"** o el botón de carpeta 📁
2. Nombre: `catalog` (todo en minúsculas)
3. Enter o guardar
4. Click dentro de la carpeta `catalog/` para abrirla

✅ **Carpeta creada**

---

## 📍 PASO 4: Crear y Subir veterinarios.json

1. Click en **"Upload file"** o el botón de subir ⬆️
2. **Crea un archivo** en tu computadora llamado `veterinarios.json` con este contenido:

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
    "userType": "vet",
    "image": "",
    "code": "APF-002",
    "unit": "unidad",
    "status": "active"
  },
  {
    "id": "3",
    "name": "Desinfectante Clínico",
    "description": "Para superficies e instrumental",
    "price": 25000,
    "stock": 120,
    "category": "Equipos",
    "subcategory": "Desinfección",
    "supplier": "Vet Supplies",
    "userType": "vet",
    "image": "",
    "code": "DES-003",
    "unit": "litro",
    "status": "active"
  }
]
```

**IMPORTANTE**: Guarda el archivo como `veterinarios.json` (no .txt, no .doc)

3. En Firebase Storage, dentro de `catalog/`, click **Upload file**
4. Selecciona el archivo `veterinarios.json` que acabas de crear
5. Espera a que termine de subir

✅ **veterinarios.json subido**

---

## 📍 PASO 5: Crear y Subir petshops.json

1. Repite el mismo proceso para `petshops.json`
2. Puedes usar el mismo contenido del anterior o crear uno nuevo
3. Sube el archivo dentro de `catalog/`

✅ **petshops.json subido**

---

## 📍 PASO 6: Verificar que Funciona

### Tu estructura debería verse así:

```
📦 Storage
  └── 📁 catalog/
      ├── veterinarios.json
      └── petshops.json
```

### Ahora prueba en tu app:

1. **Refresca tu navegador** (F5 o Ctrl+R)
2. **Abre la consola** (F12)
3. **Busca estos mensajes**:

```
📥 Descargando catálogo vet desde Storage...
✅ Catálogo vet descargado: 3 productos
✅ Usando Storage como fuente principal
```

### Si ves errores de CORS:

El navegador puede tener cache. Prueba:
- Ctrl+Shift+R (recarga forzada)
- O abre en **ventana privada** (Ctrl+Shift+N)

---

## 🎉 ¡FELICIDADES!

Tu app ahora está usando Firebase Storage ✅

---

## 🔍 Troubleshooting

### ❌ Error: "storage/object-not-found"
**Causa**: El archivo no existe o está en otro lugar  
**Solución**: Verifica que los archivos estén dentro de `catalog/`

### ❌ Error: "CORS policy"
**Causa**: Las reglas no están bien configuradas  
**Solución**: Verifica Paso 2, asegúrate de publicar las reglas

### ❌ Los productos no se muestran
**Causa**: Cache del navegador  
**Solución**: Ctrl+Shift+R o ventana privada

### ❌ Firebase Storage no aparece en el menú
**Causa**: No está habilitado  
**Solución**: Vuelve al Paso 1

---

## 📸 Capturas de Pantalla Sugeridas

**¿No encuentras algo?** Aquí tienes las ubicaciones exactas:

- **Storage**: Menú lateral izquierdo, icono 📦
- **Rules**: Pestaña en la parte superior, junto a "Files"
- **Upload**: Botón ⬆️ o "Upload file"
- **Create folder**: Icono de carpeta 📁

---

## 🆘 ¿Necesitas Ayuda?

Si algo no funciona:
1. Comparte lo que ves en la consola del navegador (F12)
2. Verifica que completaste los 5 pasos
3. Revisa que los archivos JSON estén en `catalog/`

---

**Siguiente paso**: Desplegar Cloud Function para actualización automática  
📖 Ver: `docs/DEPLOYMENT.md`

