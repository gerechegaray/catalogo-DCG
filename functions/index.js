const {onRequest} = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

/**
 * Cloud Function que actualiza el catálogo de productos desde Alegra
 * y lo guarda en Firebase Storage como archivos JSON
 * 
 * Esta función se ejecuta automáticamente cada día via Cloud Scheduler
 */
exports.updateCatalog = onRequest(async (req, res) => {
  try {
    console.log('🔄 Iniciando actualización de catálogo...');
    
    // Credenciales de Alegra desde variables de entorno
    const ALEGRA_API_KEY = process.env.ALEGRA_API_KEY;
    const ALEGRA_BASE_URL = process.env.ALEGRA_BASE_URL || 'https://api.alegra.com/api/v1';
    
    if (!ALEGRA_API_KEY) {
      res.status(500).json({ error: 'ALEGRA_API_KEY no está configurada' });
      return;
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
      
      // Extraer datos necesarios (sin información sensible)
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
      
      // Todos los productos de veterinarios van a su catálogo
      veterinarianProducts.push(cleanProduct);
      
      // Solo los productos con precio para pet shops van a su catálogo
      if (isForPetShops) {
        const petProduct = { ...cleanProduct };
        petProduct.price = extractPrice(product.price, 'pet');
        petProduct.userType = 'pet';
        petShopProducts.push(petProduct);
      }
    });
    
    console.log(`📦 ${veterinarianProducts.length} productos para veterinarios`);
    console.log(`🐾 ${petShopProducts.length} productos para pet shops`);
    
    // Guardar en Firebase Storage
    const bucket = admin.storage().bucket();
    
    // Subir catálogo de veterinarios
    const vetFile = bucket.file('catalog/veterinarios.json');
    await vetFile.save(JSON.stringify(veterinarianProducts, null, 2), {
      metadata: {
        contentType: 'application/json',
        cacheControl: 'public, max-age=3600', // Cache de 1 hora
      },
    });
    
    console.log('✅ Catálogo de veterinarios subido a Storage');
    
    // Subir catálogo de pet shops
    const petFile = bucket.file('catalog/petshops.json');
    await petFile.save(JSON.stringify(petShopProducts, null, 2), {
      metadata: {
        contentType: 'application/json',
        cacheControl: 'public, max-age=3600',
      },
    });
    
    console.log('✅ Catálogo de pet shops subido a Storage');
    
    // Respuesta exitosa
    res.status(200).json({
      success: true,
      message: 'Catálogo actualizado exitosamente',
      veterinarianCount: veterinarianProducts.length,
      petShopCount: petShopProducts.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error en actualización de catálogo:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Función auxiliar para extraer el precio correcto según el tipo de usuario
 */
function extractPrice(priceLists, userType) {
  if (!priceLists || !Array.isArray(priceLists)) {
    return 0;
  }
  
  let targetPriceList = undefined;
  
  if (userType === 'pet') {
    // Para pet shops, buscar lista "pet"
    targetPriceList = priceLists.find(price => 
      price.name && price.name.toLowerCase().includes('pet')
    );
  } else {
    // Para veterinarios, buscar lista "general"
    targetPriceList = priceLists.find(price => 
      price.name && price.name.toLowerCase().includes('general')
    );
  }
  
  // Si no encuentra la lista específica, usar la principal
  if (!targetPriceList) {
    targetPriceList = priceLists.find(price => price.main === true);
  }
  
  // Si aún no encuentra nada, usar el primer precio disponible
  if (!targetPriceList && priceLists.length > 0) {
    targetPriceList = priceLists[0];
  }
  
  return targetPriceList ? parseFloat(targetPriceList.price.toString()) : 0;
}

