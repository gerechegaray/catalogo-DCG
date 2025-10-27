# 🚀 Guía de Deployment - Nueva Arquitectura con Firebase Storage

Esta guía explica cómo implementar la nueva arquitectura que usa Firebase Storage en lugar de Firestore para el catálogo de productos.

## 📋 Prerequisitos

- Node.js 18+ instalado
- Firebase CLI instalado (`npm install -g firebase-tools`)
- Cuenta de Firebase con proyecto configurado
- Credenciales de Alegra API

## 🔧 Paso 1: Instalar Dependencias de Cloud Functions

```bash
cd functions
npm install
cd ..
```

## 🔑 Paso 2: Configurar Variables de Entorno en Firebase

Configura las credenciales de Alegra en Firebase Functions:

```bash
firebase functions:config:set alegra.api_key="TU_API_KEY_AQUI" alegra.base_url="https://api.alegra.com/api/v1"
```

**Alternativa**: Edita `functions/index.js` y reemplaza las credenciales hardcodeadas (líneas 17-23).

## 🚀 Paso 3: Desplegar la Cloud Function

```bash
firebase deploy --only functions
```

Esto desplegará la función `updateCatalog` que actualiza el catálogo desde Alegra y lo guarda en Storage.

## ⏰ Paso 4: Configurar Cloud Scheduler (Actualización Automática)

Para que el catálogo se actualice automáticamente todos los días:

### Opción A: Desde Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Extensions** → Busca "Cloud Scheduler"
4. O ve a [Cloud Console](https://console.cloud.google.com/)
5. Navega a **Cloud Scheduler**
6. Crea un nuevo job con:
   - **Nombre**: `update-catalog-daily`
   - **Frecuencia**: `0 3 * * *` (3:00 AM todos los días)
   - **Target**: HTTP
   - **URL**: `https://TU-REGION-TU-PROJECT.cloudfunctions.net/updateCatalog`
   - **HTTP Method**: GET

### Opción B: Desde Command Line

```bash
gcloud scheduler jobs create http update-catalog-daily \
  --schedule="0 3 * * *" \
  --uri="https://TU-REGION-TU-PROJECT.cloudfunctions.net/updateCatalog" \
  --http-method=GET
```

## 🎯 Paso 5: Ejecutar la Función Manualmente (Primera Vez)

Para generar los archivos JSON iniciales en Storage:

```bash
# Obtener la URL de tu función
firebase functions:config:get

# Ejecutar manualmente (reemplaza con tu URL)
curl https://TU-REGION-TU-PROJECT.cloudfunctions.net/updateCatalog
```

O desde Firebase Console:
1. Ve a **Functions**
2. Busca `updateCatalog`
3. Click en **Test function**
4. Ejecuta

## ✅ Paso 6: Verificar que los Archivos Estén en Storage

1. Ve a Firebase Console → **Storage**
2. Verifica que existan estos archivos:
   - `catalog/veterinarios.json`
   - `catalog/petshops.json`

## 🔍 Paso 7: Verificar el Frontend

1. Ejecuta el frontend: `npm run dev`
2. Abre el navegador en modo desarrollador (F12)
3. Ve a la consola
4. Deberías ver mensajes como:
   ```
   📥 Descargando catálogo vet desde Storage...
   ✅ 300 productos obtenidos desde Storage
   ```

## 🐛 Troubleshooting

### Error: "storage/object-not-found"

Los archivos JSON no existen en Storage. Ejecuta la Cloud Function manualmente.

### Error: "Cloud Function no responde"

Verifica que la función esté desplegada:
```bash
firebase functions:list
```

### Los productos no se muestran

1. Verifica los logs de la Cloud Function:
   ```bash
   firebase functions:log
   ```

2. Verifica la consola del navegador para errores

3. Verifica que `userType` se esté pasando correctamente en `ProductContext`

## 📊 Comparación de Costos

### Antes (Firestore):
- 200 clientes × 300 lecturas = **60,000 lecturas/día**
- Límite gratuito: 50,000/día
- **COSTO**: $0.06 por 1,000 lecturas adicionales = ~$0.60/mes

### Ahora (Storage):
- 200 clientes × 1 descarga = **200 descargas/día**
- Límite gratuito: 50,000/día
- **COSTO**: $0.00/mes

### Cloud Functions:
- 1 ejecución diaria × 30 días = **30 invocaciones/mes**
- Límite gratuito: 2 millones/mes
- **COSTO**: $0.00/mes

### Cloud Scheduler:
- 1 job diario
- Límite gratuito: 3 jobs activos
- **COSTO**: $0.00/mes

## 🎉 ¡Listo!

Tu catálogo ahora se actualiza automáticamente cada día a las 3:00 AM y los clientes descargan los productos desde Firebase Storage de forma más eficiente.

## 🔄 Migración Desde Firestore

Para migrar completamente de Firestore a Storage:

1. ✅ Desplegar Cloud Functions (ya hecho)
2. ✅ Configurar Cloud Scheduler (ya hecho)
3. ⏳ Esperar 24 horas para que se genere el primer JSON
4. ⏳ Monitorar que funcione correctamente
5. ⏳ Una vez verificado, puedes eliminar la colección `products` de Firestore
6. ⏳ Actualizar código para remover métodos obsoletos

## 📝 Notas Importantes

- Los **Analytics** siguen usando Firestore (esto está bien, usa pocas lecturas)
- El **caché de productos** ya no se guarda en Firestore
- Los archivos JSON se actualizan **una vez al día**
- Si necesitas actualizar manualmente, ejecuta la Cloud Function
- El tamaño típico del JSON es ~500KB (300 productos)

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs: `firebase functions:log`
2. Revisa la consola del navegador
3. Verifica que las credenciales de Alegra sean correctas
4. Verifica que Storage esté habilitado en Firebase

---

**Última actualización**: 2024
**Versión**: 2.0 (Arquitectura con Firebase Storage)

