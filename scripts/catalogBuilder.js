/**
 * Catálogo desde Alegra: precio único + disponibilidad por canal.
 *
 * - Precio (`price`): se toma de la lista cuyo nombre incluye "general"; si no hay,
 *   del primer precio de `product.price` (misma regla operativa que antes para el valor de venta).
 * - Listas con "pet" en el nombre: no definen otro precio; solo marcan que el ítem puede
 *   venderse en pet shop → `availableFor.pet`.
 * - Compat temporal: `price_vet` y `price_pet` en el ítem normalizado = `price` (mirror).
 */

/**
 * Precio de catálogo único a partir de las listas de Alegra (`product.price`).
 * @param {Array<{ name?: string, price?: unknown }>|undefined} priceLists
 * @returns {number}
 */
export function resolveCatalogPrice(priceLists) {
  if (!priceLists || !Array.isArray(priceLists) || priceLists.length === 0) {
    return 0
  }

  const lower = (name) => (name && String(name).toLowerCase()) || ''

  let target = priceLists.find((p) => lower(p.name).includes('general'))
  if (!target) {
    target = priceLists[0]
  }

  if (!target || target.price == null) {
    return 0
  }

  return parseFloat(String(target.price))
}

/**
 * Indica si Alegra tiene una lista "pet" (el producto puede ofrecerse en canal pet shop).
 * @param {Array<{ name?: string }>|undefined} priceLists
 */
export function hasPetPriceList(priceLists) {
  if (!priceLists || !Array.isArray(priceLists)) return false
  return priceLists.some(
    (p) => p.name && String(p.name).toLowerCase().includes('pet')
  )
}

/**
 * @param {object} product - ítem crudo de Alegra /items
 */
export function normalizeAlegraProduct(product) {
  const priceLists = product.price || []
  const price = resolveCatalogPrice(priceLists)
  const availableFor = {
    vet: true,
    pet: hasPetPriceList(priceLists)
  }

  return {
    id: String(product.id),
    sku: product.reference || '',
    name: product.name,
    price,
    /** @deprecated usar `price`; se mantiene por compatibilidad */
    price_vet: price,
    /** @deprecated usar `price`; se mantiene por compatibilidad */
    price_pet: price,
    availableFor,
    stock: product.inventory?.availableQuantity ?? 0,
    image: product.images?.[0]?.url || '',
    category: product.description || '',
    description: product.description || '',
    subcategory: product.itemCategory?.name || '',
    supplier: product.description || '',
    unit: product.inventory?.unit || 'unidad',
    status: product.status,
    priceLists
  }
}

/**
 * @param {object[]} products
 * @returns {{ normalizedItems: ReturnType<typeof normalizeAlegraProduct>[] }}
 */
export function buildCatalog(products) {
  const normalizedItems = []
  for (const product of products) {
    if (product.status !== 'active') continue
    normalizedItems.push(normalizeAlegraProduct(product))
  }
  return { normalizedItems }
}

/**
 * JSON legacy para el frontend (sin cambiar forma de filas).
 *
 * - veterinarios: todos los ítems activos (un precio por fila).
 * - petshops: solo ítems con `availableFor.pet`.
 *
 * @param {object[]} products
 * @param {{ includePriceLists?: boolean }} [options]
 */
export function buildLegacyCatalogFiles(products, options = {}) {
  const { includePriceLists = false } = options
  const { normalizedItems } = buildCatalog(products)

  const veterinarianProducts = []
  const petShopProducts = []

  for (const n of normalizedItems) {
    const baseRow = {
      id: n.id,
      name: n.name,
      description: n.description,
      price: n.price,
      stock: n.stock,
      category: n.category,
      subcategory: n.subcategory,
      supplier: n.supplier,
      image: n.image,
      code: n.sku,
      unit: n.unit,
      status: n.status
    }

    veterinarianProducts.push({
      ...baseRow,
      userType: n.availableFor.pet ? 'both' : 'vet',
      ...(includePriceLists ? { priceLists: n.priceLists } : {})
    })

    if (n.availableFor.pet) {
      petShopProducts.push({
        ...baseRow,
        userType: 'pet',
        ...(includePriceLists ? { priceLists: n.priceLists } : {})
      })
    }
  }

  return { veterinarianProducts, petShopProducts }
}

/**
 * @deprecated Usar `resolveCatalogPrice`. Se conserva por si algún script externo lo importaba.
 * @param {Array<{ name?: string, price?: unknown }>|undefined} priceLists
 * @param {'vet'|'pet'} _channel ignorado; el precio de catálogo es único.
 */
export function extractListPrice(priceLists, _channel) {
  return resolveCatalogPrice(priceLists)
}
