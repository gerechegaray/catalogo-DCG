# 🧪 Guía de Testing Manual

## ✅ Flujo Completo a Probar

### **1. Registro de Cliente Nuevo**

**Pasos:**
1. Abre la app en modo incógnito
2. Ve a `/client/login`
3. Click en "Continuar con Google"
4. Selecciona una cuenta de Google
5. Deberías ver: "Esperando aprobación del administrador"

**✅ Resultado esperado:**
- Cliente creado en Firestore con `pendingApproval: true`
- No puede acceder al dashboard
- Mensaje de "Pendiente de aprobación"

---

### **2. Admin Aprueba Cliente**

**Pasos:**
1. Abre `/admin` (en otra ventana)
2. Ingresa código: `ADMIN2025`
3. Busca el botón "Gestionar Clientes"
4. Deberías ver la lista de clientes pendientes
5. Click en el cliente que acabas de registrar
6. Formulario de aprobación:
   - Ingresa un **ID de Alegra válido** (ej: "123")
   - Selecciona tipo: Veterinario o Pet Shop
   - Verifica que se auto-completan `businessName` y `contactPhone`
   - Click en "Aprobar Cliente"

**✅ Resultado esperado:**
- Cliente actualizado con `pendingApproval: false`
- `isActive: true`
- Datos de Alegra cargados automáticamente
- Se registra `approvedBy` y `approvedAt`

**❌ Si falla:**
- Verifica la consola del navegador
- Verifica que el ID de Alegra existe
- Revisa que las reglas de Firestore están desplegadas

---

### **3. Cliente Ve su Dashboard**

**Pasos:**
1. Vuelve a la ventana del cliente (o abre `/client/login` otra vez)
2. El cliente debería estar logueado automáticamente
3. Verifica que puede ver:
   - Saldo pendiente (de Alegra)
   - Facturas pendientes
   - Facturas vencidas
   - Promociones destacadas

**✅ Resultado esperado:**
- Dashboard carga correctamente
- Muestra datos reales de Alegra
- No hay errores en consola

---

### **4. Cliente Ve su Estado de Cuenta**

**Pasos:**
1. Click en "Ver Estado Completo"
2. Verifica la tabla de facturas

**✅ Resultado esperado:**
- Solo muestra facturas con `status: 'open'`
- Muestra número de factura (no ID)
- Calcula correctamente: Total Nakura - Pagos = Saldo Pendiente
- Separa facturas vencidas vs. próximas a vencer

---

### **5. Cliente Ve Promociones**

**Pasos:**
1. Navega a `/client/promotions`
2. Verifica que muestra:
   - Anuncios públicos relevantes
   - Promociones para su tipo (vet/pet)
   - Descuentos exclusivos (si tiene alguno asignado)

**✅ Resultado esperado:**
- Filtros funcionan (Todas, Promociones, etc.)
- Solo muestra promociones válidas (fechas correctas)
- No muestra promociones de otros clientes

---

### **6. Admin Crea Promoción**

**Pasos:**
1. En AdminPage, sección "Gestión de Comunicados"
2. Click "Agregar Nuevo Comunicado"
3. Selecciona tipo:
   - **Anuncio Público**: Debe aparecer en páginas públicas
   - **Promoción**: Debe aparecer en portal de clientes
   - **Descuento Exclusivo**: Seleccionar cliente específico
4. Llena los campos requeridos
5. Guarda

**✅ Resultado esperado:**
- Promoción aparece en lista
- Se puede activar/desactivar
- Aparece en el lugar correcto según tipo

---

## 🐛 Problemas Comunes

### **Cliente no aparece en lista de pendientes**
- **Causa**: Firestore Rules no desplegadas
- **Solución**: Desplegar reglas en Firebase Console

### **Error al aprobar cliente**
- **Causa**: ID de Alegra inválido o no existe
- **Solución**: Verificar ID en Alegra o usar uno válido

### **Dashboard muestra $0 en todo**
- **Causa**: Cliente no tiene facturas en Alegra
- **Solución**: Crear facturas de prueba en Alegra

### **Promociones no aparecen**
- **Causa**: Fe schemas expiradas o `active: false`
- **Solución**: Verificar fechas y estado en AdminPage

---

## ✅ Checklist Final

Antes de ir a producción, verifica:

- [ ] Cliente puede registrarse con Google
- [ ] Admin puede aprobar cliente
- [ ] Cliente ve su dashboard correctamente
- [ ] Datos de Alegra se cargan correctamente
- [ ] Promociones se muestran según tipo
- [ ] Firestore Rules están desplegadas
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en consola de Firebase

---

## 🚀 ¿Todo Funciona?

Si todos los pasos funcionan correctamente, **¡estás listo para producción!**

Si encuentras problemas, anótalos y los solucionamos.

