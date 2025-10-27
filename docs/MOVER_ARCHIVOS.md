# 📁 Mover Archivos a la Carpeta "catalog"

## ⚠️ Problema

Los archivos están en la raíz del Storage, pero el código los busca en `catalog/`

## ✅ Solución Rápida

### En Firebase Console → Storage:

1. **Click en "Create folder"** o botón de carpeta 📁
2. Nombre: `catalog` (todo minúsculas)
3. Enter

4. **Arrastra** `veterinarios.json` y `petshops.json` dentro de `catalog/`
   - O selecciona los archivos → tres puntos → "Move" → `catalog/`

5. **Verifica** que la estructura sea:

```
📦 Storage
  ├── veterinarios.json  (eliminar estos de aquí)
  ├── petshops.json      (eliminar estos de aquí)
  └── 📁 catalog/
      ├── veterinarios.json  ✅
      └── petshops.json      ✅
```

### Si no puedes mover:
1. Descarga los archivos JSON
2. Elimina los originales
3. Sube nuevamente dentro de `catalog/`

## 🎉 Listo

Refresca el navegador (F5) y deberías ver:
```
✅ Catálogo descargado desde Storage
```

