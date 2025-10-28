# 🔥 Guía Visual: Configurar Google Auth en Firebase

## 📍 Paso 1: Ir a la Pestaña Correcta

Estás actualmente en la pestaña **"Usuarios"** (Users).

**Debes hacer click en:** **"Método de acceso"** (Sign-in method)

---

## 📝 Paso a Paso Visual:

### 1️⃣ Ver las Pestañas Disponibles

En la parte superior de "Authentication", verás estas pestañas:

```
[Usuarios] [Método de acceso] [Plantillas] [Uso] [Configuración] [Extensions]
```

### 2️⃣ Click en "Método de acceso"

Click en la segunda pestaña: **"Método de acceso"** (Sign-in method)

### 3️⃣ Verás una Lista de Proveedores

Verás algo como:

```
Proveedores de acceso disponibles:

📧 Correo electrónico/Contraseña  [Disabled]
🔵 Google                         [Disabled]
📘 Facebook                       [Disabled]
📧 GitHub                         [Disabled]
... (otros proveedores)
```

### 4️⃣ Click en "Google"

Haz click en la fila de **"Google"**

### 5️⃣ Se Abrirá un Modal

Verás un modal con estos campos:

```
🔵 Google

Active este proveedor de acceso: [Toggle OFF]  ← Activa este toggle

📧 Email de soporte del proyecto:
[campo de texto: gerechegaray@gmail.com]

📧 Email de soporte (usuado para OAuth...):
[campo de texto: gerechegaray@gmail.com]

-------------------------------------------

[Cancelar]  [Guardar]
```

### 6️⃣ Activar y Guardar

1. **Activa el toggle** de "Active este proveedor de acceso"
2. **Guarda tu email** en los campos (o déjalo como está)
3. **Click en "Guardar"**

### 7️⃣ ¡Listo! Ver Dominios Autorizados

**Después de guardar**, si haces click de nuevo en "Google", verás:

```
🔵 Google (Enabled)

📋 Email de soporte:
gerechegaray@gmail.com

📋 Dominios autorizados:
  • localhost           ✅ (auto-agregado)
  • catalogo-veterinaria-alegra.firebaseapp.com  ✅ (auto-agregado)

Puedes agregar más dominios si lo necesitas.
```

---

## ✅ Checklist

- [ ] Estoy en la pestaña "Método de acceso"
- [ ] Busco "Google" en la lista de proveedores
- [ ] Click en "Google"
- [ ] Activo el toggle
- [ ] Click en "Guardar"
- [ ] Verifico que "localhost" está en dominios autorizados

---

## 🎯 Cuándo Veo "Dominios Autorizados"?

**Solo después de:**
1. Habilitar Google provider
2. Guardar
3. Click de nuevo en Google para ver los detalles

Si NO habilitaste Google, NO verás la sección de dominios autorizados.

---

## ⚠️ Si Aún No Lo Ves

1. ¿Guardaste los cambios? (click en "Guardar")
2. ¿Recargaste la página?
3. ¿Click de nuevo en "Google" para ver los detalles?

Los dominios autorizados aparecen **después** de guardar, cuando abres de nuevo la configuración de Google.

