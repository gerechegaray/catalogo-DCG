import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { buildLegacyCatalogFiles, normalizeAlegraProduct } from './catalogBuilder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'catalog');

const ALEGRA_API_KEY = process.env.ALEGRA_API_KEY;
const ALEGRA_BASE_URL = process.env.ALEGRA_BASE_URL || 'https://api.alegra.com/api/v1';

const MAX_IDS_LOG = 25;

function parseFlags() {
  const excludeInvalid =
    process.argv.includes('--exclude-invalid') ||
    process.env.SYNC_EXCLUDE_INVALID === '1' ||
    process.env.SYNC_EXCLUDE_INVALID === 'true';
  return { excludeInvalid };
}

/**
 * Métricas solo sobre ítems con status === 'active' (los que entran al catálogo).
 * @param {object[]} allProducts
 */
function analyzeActiveCatalog(allProducts) {
  const active = allProducts.filter((p) => p.status === 'active');
  const invalidByPrice = [];
  const noStockIds = [];
  const noImageIds = [];

  for (const p of active) {
    const n = normalizeAlegraProduct(p);
    if (n.price <= 0) {
      invalidByPrice.push({ id: n.id, name: n.name || '(sin nombre)' });
    }
    const stockNum = Number(n.stock);
    if (!Number.isFinite(stockNum) || stockNum === 0) {
      noStockIds.push({ id: n.id, name: n.name || '(sin nombre)' });
    }
    if (!n.image || !String(n.image).trim()) {
      noImageIds.push({ id: n.id, name: n.name || '(sin nombre)' });
    }
  }

  return {
    totalActive: active.length,
    noPrice: invalidByPrice.length,
    noStock: noStockIds.length,
    noImage: noImageIds.length,
    invalidByPrice,
    noStockIds,
    noImageIds
  };
}

function logIdSample(label, items) {
  if (items.length === 0) return;
  const sample = items.slice(0, MAX_IDS_LOG);
  const suffix = items.length > MAX_IDS_LOG ? ` … (+${items.length - MAX_IDS_LOG} más)` : '';
  const line = sample.map((x) => `${x.id} (${x.name})`).join(', ');
  console.log(`   ${label}: ${line}${suffix}`);
}

function printQualitySummary(stats, excludeInvalid, excludedCount) {
  console.log('');
  console.log('--- Resumen calidad catálogo (solo ítems activos) ---');
  console.log(`Productos procesados: ${stats.totalActive}`);
  console.log(`Sin precio (price ≤ 0): ${stats.noPrice}`);
  console.log(`Sin stock: ${stats.noStock}`);
  console.log(`Sin imagen: ${stats.noImage}`);
  if (stats.noPrice > 0) {
    logIdSample('Sin precio', stats.invalidByPrice);
  }
  if (stats.noStock > 0) {
    logIdSample('Sin stock', stats.noStockIds);
  }
  if (stats.noImage > 0) {
    logIdSample('Sin imagen', stats.noImageIds);
  }
  if (excludeInvalid) {
    console.log(`Exclusión activada: se omitieron ${excludedCount} ítem(s) activo(s) con precio ≤ 0 del JSON.`);
  } else {
    console.log('Exclusión de inválidos: no (usar --exclude-invalid o SYNC_EXCLUDE_INVALID=1 para omitir sin precio).');
  }
  console.log('-----------------------------------------------------');
  console.log('');
}

/**
 * Descarga Alegra, arma JSON con catalogBuilder y escribe public/catalog/.
 */
async function syncCatalogToPublic() {
  const { excludeInvalid } = parseFlags();

  try {
    console.log('🔄 Iniciando extracción de catálogo desde Alegra vía GitHub Actions...');
    if (excludeInvalid) {
      console.log('⚙️  Modo: excluir del catálogo productos activos con precio ≤ 0');
    }

    if (!ALEGRA_API_KEY || typeof ALEGRA_API_KEY !== 'string') {
      throw new Error('ALEGRA_API_KEY no definida o inválida');
    }

    let authHeader = '';
    if (ALEGRA_API_KEY.startsWith('Basic ')) {
      authHeader = ALEGRA_API_KEY;
    } else if (!ALEGRA_API_KEY.includes('@') && !ALEGRA_API_KEY.includes(':') && ALEGRA_API_KEY.length > 20) {
      authHeader = `Basic ${ALEGRA_API_KEY}`;
    } else {
      const rawKey = ALEGRA_API_KEY.replace(/:$/, '');
      authHeader = `Basic ${Buffer.from(rawKey).toString('base64')}`;
    }

    const headers = {
      Authorization: authHeader,
      'Content-Type': 'application/json'
    };

    let allProducts = [];
    let page = 1;
    let hasMore = true;

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

    console.log(`✅ Extracción lista: ${allProducts.length} productos totales (todas las páginas).`);

    const stats = analyzeActiveCatalog(allProducts);

    let catalogSource = allProducts;
    let excludedCount = 0;
    if (excludeInvalid) {
      const activeCount = stats.totalActive;
      excludedCount = stats.noPrice;
      catalogSource = allProducts.filter((p) => {
        if (p.status !== 'active') return true;
        return normalizeAlegraProduct(p).price > 0;
      });
      if (excludedCount > 0) {
        console.log(`🧹 Excluidos del catálogo: ${excludedCount} activo(s) con precio ≤ 0 (de ${activeCount} activos).`);
      }
    }

    const { veterinarianProducts, petShopProducts } = buildLegacyCatalogFiles(catalogSource);

    printQualitySummary(stats, excludeInvalid, excludedCount);

    console.log(`📦 Catálogo generado — Veterinarios: ${veterinarianProducts.length} | Pet shops: ${petShopProducts.length}`);

    if (!fs.existsSync(PUBLIC_DIR)) {
      console.log('📁 Creando carpeta /public/catalog...');
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

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
    process.exit(1);
  }
}

syncCatalogToPublic();
