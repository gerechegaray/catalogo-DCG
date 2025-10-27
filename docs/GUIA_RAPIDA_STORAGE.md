# 🚀 Guía Rápida: Configurar Firebase Storage (3 Pasos Simples)

## ⚠️ Problema Actual
Los errores de CORS aparecen porque:
1. Firebase Storage **no está habilitado** en tu proyecto
2. Las **reglas de Storage** no permiten lectura pública
3. Los **archivos JSON no existen** en Storage

## ✅ Solución en 3 Pasos

### **PASO 1: Habilitar Firebase Storage**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `catalogo-veterinaria-alegra`
3. Click en **Storage** en el menú lateral
4. Click en **Get Started**
5. Selecciona **Production mode** → **Next**
6. Usa la ubicación por defecto → **Done**

**¡Listo!** Storage ahora está habilitado.

---

### **PASO 2: Configurar Reglas de Storage**

1. En Firebase Console → **Storage** → Tab **Rules**
2. Reemplaza el contenido por esto:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública de catálogos
    match /catalog/{fileName} {
      allow read: if true;
    }
    
    // Resto necesita autenticación
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click en **Publish**

---

### **PASO 3: Subir los Archivos JSON**

#### **Opción A: Desde la Consola Web (RECOMENDADO)**

1. En Firebase Console → **Storage**
2. Click en **Create folder** → Nombra: `catalog`
3. Click en **Upload file** dentro de `catalog/`
4. Crea un archivo `veterinarios.json` con este contenido:

```json
[
  {
    "id": "1",
    "name": "Vacuna Antirrábica",
    "price": 45000,
    "stock": 150,
    "category": "Vacunas",
    "userType": "vet"
  }
]
```

5. Repite para `petshops.json` (puede ser el mismo por ahora)

#### **Opción B: Usando Firebase Admin SDK**

Si tienes Firebase CLI instalado:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar (si no lo has hecho)
firebase init storage

# Subir archivos (crea los .json primero)
firebase storage:upload catalog/veterinarios.json catalog/veterinarios.json
firebase storage:upload catalog/petshops.json catalog/petshops.json
```

---

## 🎉 ¡LISTO! Verifica

1. **Refresca el navegador** (F5)
2. **Abre la consola** (F12)
3. **Deberías ver**:

```
⚠️ Catálogo no disponible en Storage para vet: storage/object-not-found
⚠️ Storage no disponible, usando Firestore
📖 Cargando productos desde cache...
✅ Productos cargados desde Firestore
```

**¡NO MÁS ERRORES DE CORS!** 🎉

---

## 📋 Checklist Rápido

- [ ] Storage habilitado en Firebase Console
- [ ] Reglas configuradas y publicadas
- [ ] Carpeta `catalog/` creada
- [ ] Archivos `veterinarios.json` y `petshops.json` subidos
- [ ] Refrescar navegador

---

## 🔄 Próximos Pasos

Una vez configurado Storage:

1. **Desplegar Cloud Function** (ver `docs/DEPLOYMENT.md`)
2. **Configurar Cloud Scheduler** para actualización diaria
3. **Eliminar archivos manuales** (la función los generará automáticamente)

---

## ❓ Si Sigues Viendo Errores

### Error: "storage/object-not-found"
✅ **ESPERADO** - Significa que Storage funciona pero los archivos no existen
➡️ Sube los archivos JSON (Paso 3)

### Error: "CORS policy"
❌ Storage no está habilitado o las reglas están mal
➡️ Verifica Paso 1 y Paso 2

### Los productos no se muestran
⚠️ Usa Firestore mientras configuras Storage
➡️ El fallback debería funcionar automáticamente

---

**¿Necesitas ayuda?** Consulta los logs en la consola del navegador (F12)

