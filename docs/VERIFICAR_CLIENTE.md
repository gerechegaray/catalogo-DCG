# 🔍 Cómo Verificar el Cliente en Firebase

## Pasos en Firebase Console:

1. Ve a: https://console.firebase.google.com/
2. Selecciona: `catalogo-veterinaria-alegra`
3. Ve a: **Firestore Database**
4. Click en la colección: **`clients`**
5. Deberías ver 1 documento (tu usuario)

## Qué Verificar:

El documento debería verse así:

```json
{
  "email": "tu-email@gmail.com",
  "displayName": "Tu Nombre",
  "photoURL": "https://...",
  "pendingApproval": true,    ← IMPORTANTE
  "isActive": false,          ← IMPORTANTE
  "createdAt": "..."
}
```

## Si NO tiene `pendingApproval`:

Significa que el perfil no se creó correctamente con nuestro código nuevo.

**Solución:** Borra el documento y vuelve a hacer login con Google.

## Si SÍ tiene `pendingApproval: true`:

Entonces el problema es en la consulta o en los permisos de Firestore.

**Siguiente paso:** Verificar Firestore Rules

