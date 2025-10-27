# 📍 Dónde Encontrar CORS en Google Cloud Console

## Estás en "Permissions" (Permisos) ❌

**CORS NO está ahí.** 

## ✅ Ve a "Configuration" (Configuración)

1. En la página del bucket, busca las **pestañas** arriba:
   - Overview (Vista general)
   - **Configuration** (Configuración) ← **CLICK AQUÍ**
   - Objects (Objetos)
   - Permissions (Permisos) ← Estás aquí

2. Click en **"Configuration"** o **"Configuración"**

3. Scroll hacia abajo hasta ver: **"CORS"**

4. Click en **"Edit CORS configuration"** o **"Editar configuración CORS"**

5. Pega esto:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

6. **Guardar**

7. Refresca tu app

---

## 🗺️ Ruta Completa

```
Google Cloud Console
→ Cloud Storage
→ Buckets
→ catalogo-veterinaria-alegra.firebasestorage.app
→ **Pestaña "Configuration"** (no "Permissions")
→ Scroll abajo
→ Sección "CORS"
→ Edit
```

---

**¿Encuentras la pestaña "Configuration"?**

