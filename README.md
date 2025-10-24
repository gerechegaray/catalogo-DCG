# 🐾 Catálogo Veterinario Alegra

Un sistema de catálogo digital especializado para veterinarios y pet shops, integrado con Alegra ERP y Firebase para gestión de productos, inventario y comunicaciones.

## ✨ Características Principales

- **🔐 Autenticación Segura**: Sistema de login con Firebase Authentication
- **📱 Responsive Design**: Optimizado para desktop, tablet y móvil
- **🛒 Carrito de Compras**: Gestión de productos seleccionados
- **🔍 Filtros Avanzados**: Búsqueda por categorías, marcas y características
- **📊 Gestión de Inventario**: Sincronización automática con Alegra ERP
- **💬 Comunicaciones**: Integración con WhatsApp para consultas
- **👥 Roles de Usuario**: Acceso diferenciado para veterinarios y pet shops
- **⚡ Performance**: Carga rápida con lazy loading y optimizaciones

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Backend Integration**: Alegra API
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Testing**: Jest + Testing Library
- **Icons**: Lucide React

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── AdminLogin.jsx
│   ├── BrandManager.jsx
│   ├── CartSidebar.jsx
│   ├── FeaturedProducts.jsx
│   └── ...
├── context/            # Contextos de React
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── ProductContext.tsx
├── pages/              # Páginas principales
│   ├── HomePage.jsx
│   ├── VeterinariosPage.jsx
│   ├── PetShopsPage.jsx
│   └── ...
├── services/           # Servicios de API
│   ├── alegraService.ts
│   ├── cacheService.js
│   └── communicationsService.js
├── config/             # Configuraciones
│   ├── appConfig.ts
│   └── firebase.js
└── utils/              # Utilidades
    ├── configFileManager.js
    └── populateBrands.js
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Alegra ERP
- Proyecto de Firebase

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/gerechegaray/catalogo-DCG.git
   cd catalogo-veterinario-alegra
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar `.env` con tus credenciales:
   ```env
   VITE_ALEGRA_API_KEY=tu_api_key_aqui
   VITE_FIREBASE_API_KEY=tu_firebase_api_key
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

Para más detalles, consulta la [Guía de Instalación](docs/INSTALLATION.md).

## 📖 Documentación

- [🔧 Guía de Instalación](docs/INSTALLATION.md) - Setup completo del proyecto
- [⚙️ Documentación Técnica](docs/TECHNICAL.md) - Arquitectura y componentes
- [🔌 Guía de APIs](docs/API.md) - Integraciones con servicios externos
- [👨‍💻 Guía de Desarrollo](docs/DEVELOPMENT.md) - Convenciones y mejores prácticas

## 🎯 Funcionalidades por Rol

### Veterinarios
- Acceso a productos veterinarios especializados
- Gestión de inventario médico
- Comunicación directa con proveedores
- Carrito de compras optimizado

### Pet Shops
- Catálogo de productos para mascotas
- Gestión de stock comercial
- Herramientas de comunicación
- Sistema de pedidos integrado

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🚀 Deployment

```bash
# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Contacto

- **Desarrollador**: [gerechegaray@gmail.com](mailto:gerechegaray@gmail.com)
- **Proyecto**: [GitHub Repository](https://github.com/gerechegaray/catalogo-DCG)

## 🙏 Agradecimientos

- [Alegra ERP](https://www.alegra.com/) por la API de gestión empresarial
- [Firebase](https://firebase.google.com/) por los servicios de autenticación y base de datos
- [React](https://reactjs.org/) y [Vite](https://vitejs.dev/) por el framework de desarrollo

---

⭐ Si este proyecto te resulta útil, ¡no olvides darle una estrella!