# 🔧 Configurar Metadatos del Archivo

## El problema

Los archivos están en Storage pero tienen restricciones de CORS. Necesitamos configurar sus metadatos.

## ✅ Solución: Configurar Metadatos

1. En Firebase Console → **Storage** → Tab **"Files"**
2. Click en la carpeta `catalog/`
3. Click en los **tres puntos** (...) junto a `veterinarios.json`
4. Click en **"Actualizar metadatos"** o **"Edit metadata"**
5. En "Content type", asegúrate que diga: `application/json`
6. Guarda cambios
7. Repite con `petshops.json`

### Alternativa (Más Rápida):

Si no ves la opción de metadatos, en Firebase Console:
1. Click en los **tres puntos** del archivo
2. Click en **"Download"** o **"Descargar"**
3. Verifica que el archivo descarga correctamente
4. Si descarga bien, el problema es solo de caché del navegador

## 🔄 O simplemente espera...

El **fallback a Firestore está funcionando perfectamente**:
- ✅ No hay errores
- ✅ Los productos se cargan
- ✅ El sistema funciona

**Puedes dejar esto así** y el sistema funcionará con Firestore mientras desarrollas.

Cuando despliegues la Cloud Function en producción, ella subirá los archivos con los metadatos correctos y todo funcionará.

---

**¿Preferirías dejar el fallback a Firestore por ahora?**

