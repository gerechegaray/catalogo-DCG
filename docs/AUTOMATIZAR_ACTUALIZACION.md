# ⏰ Cómo Automatizar la Actualización Diaria

## 🎯 Objetivo

Hacer que los archivos JSON en Storage se actualicen **automáticamente todos los días a las 3:00 AM** con los productos más recientes de Alegra.

## 📋 El Flujo Completo

```
Alegra API → Cloud Function → Storage (JSON) → Frontend
     ↓              ↓               ↓              ↓
  Productos    Actualiza a    veterinarios    Tu app
   actuales    las 3:00 AM    .json y         descarga
                              petshops.json   el JSON
```

## 🚀 Pasos para Implementar

### **1. Desplegar la Cloud Function**

La función ya está lista en `functions/index.js`. Solo hay que desplegarla:

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### **2. Configurar Cloud Scheduler (Automático Cada Día)**

Tienes 2 opciones:

#### **Opción A: Usando Firebase CLI (Más Fácil)**

Crea un archivo `scheduler-config.json`:

```json
{
  "name": "update-catalog-daily",
  "schedule": "0 3 * * *",
  "timeZone": "America/Argentina/Buenos_Aires",
  "description": "Actualiza catálogo desde Alegra cada día a las 3 AM",
  "httpTarget": {
    "uri": "TU_URL_DE_LA_FUNCTION",
    "httpMethod": "POST"
  }
}
```

Y despliégalo:
```bash
gcloud scheduler jobs create http update-catalog-daily --schedule="0 3 * * *" --uri="TU_URL" --http-method=POST --location=us-central1
```

#### **Opción B: Desde Google Cloud Console (Visual)**

1. Ve a [Cloud Console](https://console.cloud.google.com/)
2. Busca **"Cloud Scheduler"**
3. Click en **"+ CREATE JOB"**
4. Configura:
   - **Name**: `update-catalog-daily`
   - **Region**: `us-central1`
   - **Frequency**: `Every day 3:00 AM`
   - **Target type**: `HTTP`
   - **URL**: La URL de tu Cloud Function (la obtienes después de desplegar)
   - **HTTP method**: `POST`
5. **Create**

### **3. Obtener URL de la Cloud Function**

Después de desplegar, ve a:
- Firebase Console → Functions
- Copia la URL de `updateCatalog`

Ejemplo:
```
https://us-central1-catalogo-veterinaria-alegra.cloudfunctions.net/updateCatalog
```

### **4. Probar Manualmente (Primera Vez)**

Antes de esperar a las 3 AM, prueba que funciona:

1. Ve a Firebase Console → Functions
2. Busca `updateCatalog`
3. Click en **"Test"** o ejecuta desde Cloud Console
4. Verifica que sube los archivos JSON a Storage

---

## ⏰ Horarios Disponibles

El formato es: `minuto hora * * *` (cron format)

Ejemplos:
- `0 3 * * *` → Todos los días a las 3:00 AM
- `0 0 * * *` → Todos los días a medianoche
- `0 6 * * *` → Todos los días a las 6:00 AM
- `0 */6 * * *` → Cada 6 horas
- `0 3 * * 1` → Todos los lunes a las 3:00 AM

## 🌍 Zonas Horarias

Para Argentina:
- `America/Argentina/Buenos_Aires`

Para otros países:
- `America/Mexico_City` → México
- `America/Lima` → Perú
- `America/Bogota` → Colombia
- `UTC` → Tiempo Universal

## 📊 Ver Logs de Ejecución

Después de que se ejecute automáticamente:

1. Ve a Cloud Console → Cloud Scheduler
2. Click en tu job
3. Ve a **"History"** para ver ejecuciones
4 allá
4. Click en una ejecución para ver logs

---

## ✅ Verificación

Después de configurar Cloud Scheduler:

1. ✅ Los archivos JSON se actualizan automáticamente cada día
2. ✅ Tu frontend siempre tiene datos frescos de Alegra
3. ✅ No necesitas intervención manual
4. ✅ Ahorras costos de Firestore

## 🎯 Lo Que Pasa Cada Día a las 3 AM

```
03:00 - Cloud Scheduler ejecuta la función
       ↓
03:01 - Cloud Function se conecta a Alegra API
       ↓
03:02 - Obtiene TODOS los productos actualizados
       ↓
03:03 - Procesa y limpia los datos
       ↓
03:04 - Sube veterinarios.json a Storage
       ↓
03:05 - Sube petshops.json a Storage
       ↓
✅ Catálogo actualizado automáticamente
```

## 💡 Costos

**Cloud Scheduler:** Gratis (3 jobs gratis/mes, 1 invocación/día = gratis completo)

**Cloud Function:** 
- Ejecución: ~$0.0001 por invocación
- O sea: **~$0.003/mes** (3 centavos) ✅

**Storage:**
- 2 archivos JSON de ~1MB
- **$0.00/mes** (dentro del tier gratis) ✅

**Total:** Practicamente gratis ✅

---

## 🎉 ¡Listo!

Con esto, tu catálogo se actualizará **automáticamente todos los días** con los productos más frescos de Alegra, sin ningún costo adicional significativo.

