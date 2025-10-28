# 🚀 Instrucciones Rápidas - Portal de Clientes

## 📋 Paso 1: Configurar Firebase (OBLIGATORIO)

1. Ve a: https://console.firebase.google.com/
2. Selecciona proyecto: `catalogo-veterinaria-alegra`
3. Menu lateral → **Authentication**
4. Tab: **Sign-in method**
5. En la lista, busca **Google** → Click
6. Activa el toggle **"Enable"**
7. Email: `gerechegaray@gmail.com`
8. Click **"Save"**

✅ Listo para probar

---

## 🧪 Paso 2: Probar la App

```bash
npm run compress:dev
```

Luego abre:
```
http://localhost:5173/client/login
```

---

## ✨ Qué Debes Ver

1. **Pantalla de login:** Botón "Continuar con Google"
2. **Al hacer click:** Popup de Google (autorizar)
3. **Después de autorizar:** Mensaje "Esperando aprobación"
4. **En Firebase Console:**
   - Ve a Firestore
   - Colección `clients`
   - Verás el cliente con `pendingApproval: true`

---

## ⚠️ Si Ves Errores

### "auth/unauthorized-domain"
→ Verifica que `localhost` está en "Authorized domains"

### "auth/popup-blocked"
→ Permite popups en tu navegador

### "Cannot find module"
→ Ejecuta: `npm install`
