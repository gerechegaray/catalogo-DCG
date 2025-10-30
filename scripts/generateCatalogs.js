// Script para generar catálogos desde Alegra y guardarlos localmente
import axios from 'axios';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde .env
function loadEnv() {
  const envPath = join(process.cwd(), '.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').trim();
        if (key.trim()) {
          process.env[key.trim()] = value;
        }
      }
    });
  }
}

loadEnv();

async function generateCatalogs() {
  try {
    console.log('🔄 Iniciando generación de catálogos...');
    
    // Credenciales de Alegra desde variables de entorno
    const ALEGRA_API_KEY = process.env.VITE_ALEGRA_API_KEY || process.env.ALEGRA_API_KEY;
    const ALEGRA_BASE_URL = process.env.VITE_ALEGRA_BASE_URL || process.env.ALEGRA_BASE_URL || 'https://api.alegra.com/api/v1';
    
    if (!ALEGRA_API_KEY) {
      throw new Error('❌ ALEGRA_API_KEY no está configurada en las variables de entorno');
    }
    
    // Headers para la petición a Alegra
    const headers = {
      'Authorization': `Basic ${Buffer.from(`${ALEGRA_API_KEY}:`).toString('base64')}`,
      'Content-Type': 'application/json'
    };
    
    // Array para almacenar todos los productos
    let allProducts = [];
    let page = 1;
    let hasMore = true;
    
    // Paginar productos desde Alegra
    while (hasMore) {
      console.log(`📄 Obteniendo página ${page} desde Alegra...`);
      
      const response = await axios.get(
        `${ALEGRA_BASE_URL}/items?start=${(page - 1) * 30}&limit=30`,
        { headers }
      );
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('❌ Respuesta inválida de Alegra');
        break;
      }
      
      allProducts = [...allProducts, ...response.data];
      
      // Si devuelve menos de 30 productos, no hay más páginas
      hasMore = response.data.length === 30;
      page++;
      
      // Evitar loops infinitos
      if (page > 50) {
        console.warn('⚠️ Límite de páginas alcanzado');
        break;
      }
    }
    
    console.log(`✅ ${allProducts.length} productos obtenidos desde Alegra`);
    
    // Procesar y dividir productos por tipo de usuario
    const veterinarianProducts = [];
    const petShopProducts = [];
    
    allProducts.forEach(product => {
      // Filtrar solo productos activos
      if (product.status !== 'active') return;
      
      // Determinar si es para veterinarios o pet shops
      const isForPetShops = product.price?.some(price => 
        price.name && price.name.toLowerCase().includes('pet')
      );
      
      // Extraer precio
      const priceLists = product.price || [];
      let vetPrice = 0;
      let petPrice = 0;
      
      // Precio para veterinarios
      const vetPriceList = priceLists.find(price => 
        price.name && price.name.toLowerCase().includes('general')
      ) || priceLists.find(price => price.main === true) || priceLists[0];
      if (vetPriceList) vetPrice = parseFloat(vetPriceList.price.toString());
      
      // Precio para pet shops
      if (isForPetShops) {
        const petPriceList = priceLists.find(price => 
          price.name && price.name.toLowerCase().includes('pet')
        );
        if (petPriceList) petPrice = parseFloat(petPriceList.price.toString());
      }
      
      // Extraer datos necesarios
      const cleanProduct = {
        id: product.id.toString(),
        name: product.name,
        description: product.description || '',
        price: vetPrice,
        stock: product.inventory?.availableQuantity || 0,
        category: product.description || '',
        subcategory: product.itemCategory?.name || '',
        supplier: product.description || '',
        userType: isForPetShops ? 'both' : 'vet',
        image: product.images?.[0]?.url || '',
        code: product.reference || '',
        unit: product.inventory?.unit || 'unidad',
        status: product.status,
        priceLists: priceLists // Mantener lista de precios completa
      };
      
      // Todos los productos de veterinarios van a su catálogo
      veterinarianProducts.push(cleanProduct);
      
      // Solo los productos con precio para pet shops van a su catálogo
      if (isForPetShops && petPrice > 0) {
        const petProduct = { ...cleanProduct };
        petProduct.price = petPrice;
        petProduct.userType = 'pet';
        petShopProducts.push(petProduct);
      }
    });
    
    console.log(`📦 ${veterinarianProducts.length} productos para veterinarios`);
    console.log(`🐾 ${petShopProducts.length} productos para pet shops`);
    
    // Importar fs para escribir archivos
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Guardar archivos localmente
    const vetPath = path.join(process.cwd(), 'veterinarios.json');
    const petPath = path.join(process.cwd(), 'petshops.json');
    
    await fs.writeFile(vetPath, JSON.stringify(veterinarianProducts, null, 2));
    console.log('✅ Catálogo de veterinarios guardado en:', vetPath);
    
    await fs.writeFile(petPath, JSON.stringify(petShopProducts, null, 2));
    console.log('✅ Catálogo de pet shops guardado en:', petPath);
    console.log('🎉 Archivos JSON generados exitosamente');
    console.log('');
    console.log('⚠️  Ahora súbelos manualmente a Firebase Storage:');
    console.log('   1. Ve a Firebase Console > Storage');
    console.log('   2. Selecciona la carpeta "catalog"');
    console.log('   3. Sube "veterinarios.json" y "petshops.json"');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error en generación de catálogos:', error);
    process.exit(1);
  }
}

generateCatalogs();

