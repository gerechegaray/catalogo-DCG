import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

// Configuraciones base (se ejecutan en Node)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'catalog');

// Alegra API info (usar env var en GitHub Actions)
const ALEGRA_API_KEY = process.env.ALEGRA_API_KEY;
const ALEGRA_BASE_URL = process.env.ALEGRA_BASE_URL || 'https://api.alegra.com/api/v1';

/**
 * Función auxiliar para extraer el precio correcto
 */
function extractPrice(priceLists, userType) {
  if (!priceLists || !Array.isArray(priceLists)) {
    return 0;
  }
  
  let targetPriceList = undefined;
  
  if (userType === 'pet') {
    targetPriceList = priceLists.find(price => 
      price.name && price.name.toLowerCase().includes('pet')
    );
  } else {
    targetPriceList = priceLists.find(price => 
      price.name && price.name.toLowerCase().includes('general')
    );
  }
  
  if (!targetPriceList) {
    targetPriceList = priceLists.find(price => price.main === true);
  }
  
  if (!targetPriceList && priceLists.length > 0) {
    targetPriceList = priceLists[0];
  }
  
  return targetPriceList ? parseFloat(targetPriceList.price.toString()) : 0;
}

/**
 * Función principal de actualización
 */
async function updateCatalog() {
  try {
    console.log('🔄 Iniciando extracción de catálogo desde Alegra vía GitHub Actions...');
    
    if (!ALEGRA_API_KEY) {
      throw new Error('ALEGRA_API_KEY no está configurada en las variables de entorno.');
    }
    
    const headers = {
      'Authorization': `Basic ${Buffer.from(`${ALEGRA_API_KEY}:`).toString('base64')}`,
      'Content-Type': 'application/json'
    };
    
    let allProducts = [];
    let page = 1;
    let hasMore = true;
    
    // Obtener todos los productos páginados
    while (hasMore) {
      console.log(`📄 Leyendo página ${page} de Alegra...`);
      
      const response = await axios.get(
        `${ALEGRA_BASE_URL}/items?start=${(page - 1) * 30}&limit=30`,
        { headers }
      );
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('❌ Respuesta inválida de Alegra');
        break;
      }
      
      allProducts = [...allProducts, ...response.data];
      hasMore = response.data.length === 30;
      page++;
      
      if (page > 50) {
        console.warn('⚠️ Límite de seguridad de páginas alcanzado');
        break;
      }
    }
    
    console.log(`✅ Extracción lista: ${allProducts.length} productos totales.`);
    
    const veterinarianProducts = [];
    const petShopProducts = [];
    
    // Convertir y separar
    allProducts.forEach(product => {
      if (product.status !== 'active') return;
      
      const isForPetShops = product.price?.some(price => 
        price.name && price.name.toLowerCase().includes('pet')
      );
      
      const cleanProduct = {
        id: product.id.toString(),
        name: product.name,
        description: product.description || '',
        price: extractPrice(product.price, isForPetShops ? 'pet' : 'vet'),
        stock: product.inventory?.availableQuantity || 0,
        category: product.description || '',
        subcategory: product.itemCategory?.name || '',
        supplier: product.description || '',
        userType: isForPetShops ? 'both' : 'vet',
        image: product.images?.[0]?.url || '',
        code: product.reference || '',
        unit: product.inventory?.unit || 'unidad',
        status: product.status
      };
      
      veterinarianProducts.push(cleanProduct);
      
      if (isForPetShops) {
        const petProduct = { ...cleanProduct, price: extractPrice(product.price, 'pet'), userType: 'pet' };
        petShopProducts.push(petProduct);
      }
    });
    
    console.log(`📦 Vet: ${veterinarianProducts.length} | 🐾 Pet: ${petShopProducts.length}`);
    
    // Crear la carpeta contenedora si no existe
    if (!fs.existsSync(PUBLIC_DIR)) {
      console.log('📁 Creando carpeta /public/catalog...');
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }
    
    // Guardar los archivos escribiendo a disco
    fs.writeFileSync(
      path.join(PUBLIC_DIR, 'veterinarios.json'), 
      JSON.stringify(veterinarianProducts, null, 2)
    );
    
    fs.writeFileSync(
      path.join(PUBLIC_DIR, 'petshops.json'), 
      JSON.stringify(petShopProducts, null, 2)
    );
    
    console.log('🎉 Operación completada con éxito. Archivos guardados localmente.');
    
  } catch (error) {
    console.error('❌ Error fatal actualizando el catálogo:', error.message);
    process.exit(1); // Forzar fallo en el GitHub Action para notificar error
  }
}

// Iniciar
updateCatalog();
