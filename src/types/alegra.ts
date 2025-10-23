// Tipos para la API de Alegra
export interface AlegraPriceList {
  id: number;
  name: string;
  price: number;
  main?: boolean;
}

export interface AlegraInventory {
  availableQuantity: number;
  unit: string;
  warehouses?: Array<{
    id: number;
    name: string;
    quantity: number;
  }>;
}

export interface AlegraImage {
  url: string;
  name?: string;
}

export interface AlegraItemCategory {
  id: number;
  name: string;
}

export interface AlegraProduct {
  id: number;
  name: string;
  description?: string;
  reference?: string;
  status: 'active' | 'inactive';
  price: AlegraPriceList[];
  inventory?: AlegraInventory;
  images?: AlegraImage[];
  itemCategory?: AlegraItemCategory;
}

// Tipos para productos normalizados
export interface NormalizedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  subcategory: string;
  supplier: string;
  code: string;
  image: string | null;
  userType: 'vet' | 'pet';
  unit: string;
  alegraId: number;
  lastUpdated: string;
  status: string;
  warehouses: Array<{
    id: number;
    name: string;
    quantity: number;
  }>;
  priceLists: AlegraPriceList[];
  originalData: AlegraProduct;
}

// Tipos para configuración del servicio
export interface AlegraConfig {
  baseURL: string;
  apiKey: string;
  headers: Record<string, string>;
}

// Tipos para respuestas de la API
export interface AlegraApiResponse {
  data: AlegraProduct[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
