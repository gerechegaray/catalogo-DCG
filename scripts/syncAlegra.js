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
    
    let authHeader = '';
    // Si ya empieza con "Basic ", lo usamos tal cual
    if (ALEGRA_API_KEY.startsWith('Basic ')) {
      authHeader = ALEGRA_API_KEY;
    } 
    // Si no tiene arroba ni dos puntos, asumimos que es el base64 directo
    else if (!ALEGRA_API_KEY.includes('@') && !ALEGRA_API_KEY.includes(':') && ALEGRA_API_KEY.length > 20) {
      authHeader = `Basic ${ALEGRA_API_KEY}`;
    } 
    // Si contiene el formato crudo email:token
    else {
      // Remover colon al final si lo tiene agregado por error
      const rawKey = ALEGRA_API_KEY.replace(/:$/, '');
      authHeader = `Basic ${Buffer.from(rawKey).toString('base64')}`;
    }
    
    const headers = {
      'Authorization': authHeader,
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
      
      const hasPetPrice = product.price?.some(price => 
        price.name && price.name.toLowerCase().includes('pet')
      );
      
      // Catálogo Veterinarios (USA PRECIO GENERAL)
      const vetPrice = extractPrice(product.price, 'vet');
      if (vetPrice > 0) {
        veterinarianProducts.push({
          id: product.id.toString(),
          name: product.name,
          description: product.description || '',
          price: vetPrice,
          stock: product.inventory?.availableQuantity || 0,
          category: product.description || '',
          subcategory: product.itemCategory?.name || '',
          supplier: product.description || '',
          userType: hasPetPrice ? 'both' : 'vet',
          image: product.images?.[0]?.url || '',
          code: product.reference || '',
          unit: product.inventory?.unit || 'unidad',
          status: product.status
        });
      }
      
      // Catálogo Pet Shops (USA PRECIO PET)
      if (hasPetPrice) {
        const petPrice = extractPrice(product.price, 'pet');
        if (petPrice > 0) {
          petShopProducts.push({
            id: product.id.toString(),
            name: product.name,
            description: product.description || '',
            price: petPrice,
            stock: product.inventory?.availableQuantity || 0,
            category: product.description || '',
            subcategory: product.itemCategory?.name || '',
            supplier: product.description || '',
            userType: 'pet',
            image: product.images?.[0]?.url || '',
            code: product.reference || '',
            unit: product.inventory?.unit || 'unidad',
            status: product.status
          });
        }
      }
    });

    console.log(`📦 Sincronización completa. Vet: ${veterinarianProducts.length} | 🐾 Pet: ${petShopProducts.length}`);
    
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
