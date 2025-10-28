# 🐛 Debug: Integración con Alegra API

## Pasos para Debug

1. Ve a AdminPage → Gestionar Clientes
2. Abre la consola del navegador (F12)
3. Click en un cliente pendiente
4. Escribe un AlegraId en el formulario
5. Observa la consola

## Mensajes que Deberías Ver

### Si funciona correctamente:
```
🔍 Buscando contacto en Alegra con ID: 123
🔗 URL: https://api.alegra.com/api/v1/contacts/123
📊 Response status: 200
✅ Contacto encontrado: {id: 123, name: "...", ...}
✅ Datos cargados desde Alegra: {name: "...", ...}
```

### Si hay error 404:
```
❌ Cliente no encontrado en Alegra
📄 Error response: [mensaje de error]
⚠️ Cliente no encontrado en Alegra
```

### Si hay error de autenticación:
```
❌ Error en Alegra API: 401 [mensaje de error]
```

## Posibles Problemas

### 1. El ID no existe
- **Síntoma:** Error 404
- **Solución:** Verifica que el ID sea correcto en Alegra

### 2. API Key incorrecta
- **Síntoma:** Error 401
- **Solución:** Verifica la configuración en `appConfig.ts`

### 3. CORS (en desarrollo local)
- **Síntoma:** Error de CORS en consola
- **Solución:** Normal en desarrollo, debería funcionar en producción

## Para Probar

**Dime:**
1. ¿Qué mensajes ves en la consola?
2. ¿Cuál es el status code que aparece?
3. ¿Hay algún error específico?

