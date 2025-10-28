# 🐛 Debug: Clientes Pendientes

## Pasos para Debug:

1. Recarga: `http://localhost:5173/admin`
2. Abre la consola del navegador (F12)
3. Click en: **"Gestionar Clientes"**
4. Mira los mensajes en la consola

## Mensajes que Debes Ver:

```
🔍 Buscando clientes pendientes...
📊 Clientes pendientes encontrados: 0
⚠️ No hay clientes pendientes. Obteniendo todos los clientes...
📄 Todos los clientes: [ID] Data: {...}
```

## Qué Buscar:

### Si ves "📄 Todos los clientes":

- **¿Cuántos clientes hay?** (Debería ser al menos 1)
- **¿Tiene el campo `pendingApproval`?**
- **¿Qué valor tiene `pendingApproval`?**

### Posibles Problemas:

1. **No existe el campo `pendingApproval`**
   - Significa que el cliente se creó antes de nuestro código
   - **Solución:** Borrar y volver a hacer login

2. **`pendingApproval` es `false` o no existe**
   - El cliente ya fue aprobado manualmente
   - **Solución:** Crear un nuevo cliente de prueba

3. **No hay ningún cliente en la colección**
   - El login no funcionó correctamente
   - **Solución:** Volver a hacer login con Google

## Siguiente Paso:

**Comparte conmigo** qué ves en la consola:
- Cuántos clientes hay
- Qué campos tiene cada cliente
- Algún error si aparece

