# 💳 Actualizar Plan de Firebase para Storage

## ⚠️ ¿Por Qué Necesitas Actualizar?

Firebase Storage está deshabilitado en el plan **Spark** (completamente gratis).  
Necesitas el plan **Blaze** (pay-as-you-go) para usar Storage.

## ✅ ¿Cuánto Costará?

### **TIER GRATUITO (Incluido en Blaze)**

| Servicio | Gratis/mes | Tu Uso Estimado |
|----------|------------|-----------------|
| Storage | 5 GB | ~500 KB (0.0005 GB) |
| Descargas | 1 GB/día | ~100 MB/día |
| Carga | $0.00 | ✅ Gratis |

**Cálculo con tus 300 productos:**
- 2 archivos JSON × 500 KB = 1 MB total
- 200 clientes × 1 MB = 200 MB/día = 6 GB/mes
- **Límite gratis: 1 GB/día = 30 GB/mes** ✅

**Proyección de costo: $0.00 USD/mes** 🎉

### **Si Superas el Tier Gratuito (improbable)**

Si llegas a pagar algo:
- **$0.026 USD por GB de descarga** adicional
- Con 10,000 clientes/día = $0.54 USD/mes máximo

---

## 🚀 Cómo Actualizar (3 Pasos)

### **PASO 1: Click en "Actualizar proyecto"**

En Firebase Console → Storage:
1. Click en el botón naranja: **"Actualizar proyecto"**

### **PASO 2: Confirmar Plan Blaze**

1. Verás una pantalla sobre el plan **Blaze**
2. Lee los términos (solo dice que pagas por uso después del tier gratis)
3. Click en **"Iniciar"** o **"Continuar"**

### **PASO 3: Agregar Método de Pago**

Firebase pedirá que agregues tarjeta de crédito:

1. **Tarjeta de crédito** (Visa, Mastercard, etc.)
2. O **PayPal** si prefieres

⚠️ **IMPORTANTE**: Firebase NO cobrará nada automáticamente
- Solo cobra si superas el tier gratis
- Te avisará con alertas antes de cobrar
- Puedes configurar **límites de presupuesto**

---

## 🛡️ Configurar Límites de Presupuesto (RECOMENDADO)

Para estar 100% seguro:

### **Configurar Alerta de Presupuesto**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en ⚙️ **Configuración** → **Facturación y uso**
3. Ve a **"Alertas y presupuestos"**
4. Click en **"Crear presupuesto"**
5. Configura:
   - **Importe**: $5 USD/mes
   - **Alertas**: 50% ($2.50), 75% ($3.75), 90% ($4.50)

**Esto te enviará emails si gastas más de lo esperado**

---

## 📊 Tu Uso Real (Estimación)

### **Con Blaze habilitado:**

```
✅ Storage: 0.0005 GB/mes (gratis)
✅ Descargas: 0.06 GB/día (gratis)
✅ Firestore: 0.02 GB/mes (gratis)
✅ Cloud Functions: 30 invocaciones/mes (gratis)
✅ Cloud Scheduler: 1 job (gratis)

TOTAL: $0.00 USD/mes
```

### **Si creces a 10,000 clientes:**

```
✅ Storage: 0.01 GB/mes (gratis)
❌ Descargas: 10 GB/día (gratis hasta 1 GB)
   → Exceso: 9 GB/día × $0.026 = $0.23/día = $7 USD/mes
```

**Aún así súper económico** para un negocio con 10,000 clientes activos.

---

## 💰 Comparación de Costos

### **Plan Spark (Actual)**
- ❌ **Storage**: No disponible
- ✅ Firestore: 50,000 lecturas/día (insuficiente)
- **Costo**: $0.00/mes pero con limitaciones

### **Plan Blaze (Recomendado)**
- ✅ **Storage**: 5 GB gratis (suficiente)
- ✅ Firestore: Tier gratis más generoso
- ✅ Cloud Functions: 2M invocaciones/mes
- **Costo**: $0.00-5.00/mes (solo si creces mucho)

---

## ✅ Después de Actualizar

Una vez que actualices a Blaze:

1. **Storage** estará habilitado
2. Sigue: `docs/PASO_A_PASO_STORAGE.md` desde el Paso 2
3. Configura las reglas
4. Sube los archivos JSON

---

## ❓ Preguntas Frecuentes

### ¿Firebase me cobrará algo si no lo uso?
**NO**. Solo cobra por uso por encima del tier gratis.

### ¿Puedo volver al plan Spark?
**SÍ**. Pero perderás Storage y algunas funciones.

### ¿Qué pasa si me olvido de los límites?
Firebase te envía alertas automáticas. Puedes configurar **límites estrictos** que desactivan el servicio automáticamente.

### ¿Es seguro dar mi tarjeta?
**SÍ**. Firebase (Google) es una de las empresas más seguras del mundo. Millones de desarrolladores confían en ellos.

---

## 🎯 Conclusión

**TL;DR**: Actualiza a Blaze, es prácticamente gratis para tu proyecto actual y te da mucho más espacio para crecer.

**Tu costo probable: $0.00 USD/mes** ✅

---

**¿Listo para continuar?** Después de actualizar, vuelve a `docs/PASO_A_PASO_STORAGE.md` Paso 2.

