# 🔧 Solución Definitiva para CORS

## El Problema Real

Los archivos subidos manualmente desde Firebase Console no tienen configurado CORS en el bucket.

## ✅ Solución: Configurar CORS en Cloud Storage

Tienes 3 opciones:

### **Opción 1: Desde Firebase Console (Más Fácil)**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto: `catalogo-veterinaria-alegra`
3. En el buscador, escribe: **"Cloud Storage"**
4. Click en **"Buckets"**
5. Click en tu bucket: `catalogo-veterinaria-alegra.firebasestorage.app`
6. Click en la pestaña **"PERMISSIONS"** o **"PERMISOS"**
7. Scroll abajo hasta **"CORS Configuration"** o **"Configuración CORS"**
8. Click en **"Edit CORS configuration"** o editar
9. Reemplaza el contenido por:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

10. **Guardar**
11. Espera 1-2 minutos
12. Refresca tu app

### **Opción 2: Usando gsutil (Si tienes CLI)**

```bash
gsutil cors set cors.json gs://catalogo-veterinaria-alegra.firebasestorage.app
```

### **Opción 3: Desplegar Cloud Function (Recomendado)**

La Cloud Function subirá los archivos con los headers CORS correctos:

```bash
cd functions
npm install
firebase deploy --only functions
```

Luego ejecuta la función manualmente y los archivos tendrán CORS correcto.

---

## 🎯 Recomendación

**Usa Opción 1** (Google Cloud Console). Es la más rápida y no requiere instalaciones.

---

**¿Puedes ir a Google Cloud Console y configurar CORS?**

