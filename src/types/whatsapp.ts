// Tipos para WhatsApp Service
export interface WhatsAppProduct {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  code?: string;
  supplier?: string;
}

export interface ClientInfo {
  name?: string;
  phone?: string;
  userType?: 'vet' | 'pet' | 'admin' | 'public';
}

export interface WhatsAppMessage {
  message: string;
  encodedMessage: string;
  productCount: number;
  totalPrice: number;
}
