# 🔍 Verificar Reglas de Storage

## Si el 404 persiste después de mover archivos a `catalog/`, verifica las reglas:

1. Firebase Console → **Storage** → Tab **"Rules"**

2. Debe tener este código:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /catalog/{fileName} {
      allow read: if true;
    }
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"** para guardar

4. Refresca navegador (Ctrl+Shift+R)

## ✅ Debería funcionar ahora

Si sigues viendo 404, comparte:
- La URL completa del error
- Un screenshot de las reglas

