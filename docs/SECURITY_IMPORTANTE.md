# 🚨 IMPORTANTE: Seguridad de Credenciales

## ⚠️ Acción Requerida

Google Cloud detectó que tu clave de API está expuesta públicamente en GitHub.

## 🔒 Pasos Inmediatos

### 1. Regenerar Clave de API en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto: `catalogo-veterinaria-alegra`
3. Ve a **APIs & Services** → **Credentials**
4. Busca la clave: `AIzaSyA-GAWS25Pui6oMT03uavW1anaAwDEPivc`
5. Click en **Edit** (botón lápiz)
6. Click en **Regenerate Key**
7. Copia la nueva clave

### 2. Actualizar el Frontend

Edita `src/config/appConfig.ts` o donde tengas la configuración:

```typescript
// Reemplaza con la nueva clave
const firebaseConfig = {
  apiKey: 'TU_NUEVA_CLAVE_AQUI',
  // ... resto de la configuración
}
```

### 3. Guardar en Variables de Entorno

**Crear `.env.local`** (agregar a `.gitignore`):

```bash
VITE_FIREBASE_API_KEY=tu_nueva_clave
```

Y usar en el código:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // ...
}
```

### 4. Verificar Uso Actual

Ve a Google Cloud Console:
- **APIs & Services** → **Dashboard**
- Revisa el uso de APIs
- Verifica que no haya uso inusual

## 🛡️ Mejores Prácticas

### ✅ HACER
- Usar variables de entorno para credenciales
- Agregar `.env.local` a `.gitignore`
- Revisar logs de uso de APIs regularmente
- Regenerar claves periódicamente

### ❌ NO HACER
- Hardcodear claves en archivos de código
- Subir archivos `.env` a GitHub
- Compartir credenciales públicamente
- Dejar claves sin restricciones

## 📋 Checklist de Seguridad

- [ ] Regenerada la clave de API
- [ ] Actualizada en el código
- [ ] Creado `.env.local`
- [ ] Agregado `.env.local` a `.gitignore`
- [ ] Revisados logs de uso
- [ ] Commit con nueva clave sin exponerla
- [ ] Push a GitHub

## 📞 Soporte

Si ves actividad sospechosa:
1. Ve inmediatamente a Cloud Console
2. Revoca todas las claves
3. Genera nuevas claves
4. Revisa facturación

---

**Fecha de este incidente:** [Fecha actual]
**Estado:** Clave expuesta en commit anterior
**Acción:** Archivo removido del repositorio

