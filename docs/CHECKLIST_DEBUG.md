# 🔍 Checklist para Debug del 404

## Verifica TODO esto:

### 1. Archivos en Storage
- [ ] Carpeta `catalog/` existe
- [ ] `veterinarios.json` dentro de `catalog/`
- [ ] `petshops.json` dentro de `catalog/`
- [ ] Los archivos tienen contenido (no están vacíos)

### 2. Reglas de Storage
- [ ] Click en tab "Rules"
- [ ] Hay regla para `catalog/{fileName}`
- [ ] Dice `allow read: if true;`
- [ ] Click en "Publish" (publicar)
- [ ] Espera confirmación

### 3. Cache del Navegador
- [ ] Ctrl+Shift+R (forzar recarga)
- [ ] O: Ctrl+Shift+N (ventana privada)

### 4. URL de Error
La URL debe ser:
```
https://firebasestorage.googleapis.com/v0/b/catalogo-veterinaria-alegra.firebasestorage.app/o/catalog%2Fveterinarios.json
```

Si es otra URL diferente, algo está mal en la configuración.

## 📸 ¿Qué Compartir?

Si nada funciona, comparte:
1. Screenshot de Storage → Files (mostrando catalog/)
2. Screenshot de Storage → Rules
3. El mensaje completo de error en consola

## 🆘 Último Recurso

Si TODO lo demás falla:
- Elimina los archivos de catalog/
- Crea folder nuevamente
- Sube archivos otra vez
- Refresca

