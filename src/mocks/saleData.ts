import { Sale, CartItem, Customer, PaymentDetail, SaleOrigin, ConsumerType } from '../utils/types';

export interface SaleData {
  // Información básica de la venta
  id: string;
  fecha: Date;
  numero_comprobante: string;
  
  // Cliente
  cliente?: Customer;
  
  // Productos
  items: CartItem[];
  cantidad_items: number;
  
  // Importes
  subtotal: number;
  descuento: number;
  impuestos: {
    iva: number;
    otros?: number;
  };
  total: number;
  
  // Método de pago
  pagos: PaymentDetail[];
  
  // Clasificación de la venta
  origen: SaleOrigin;
  tipo_consumidor: ConsumerType;
  
  // Metadata
  vendedor: {
    id: string;
    nombre: string;
  };
  sucursal: {
    id: string;
    nombre: string;
  };
  caja: {
    id: string;
    numero: string;
  };
  
  // Estado y observaciones
  estado: 'pendiente' | 'completada' | 'anulada';
  observaciones?: string;
  
  // Auditoría
  creada: Date;
  modificada?: Date;
  anulada?: Date;
}

export interface SaleResponse {
  success: boolean;
  message: string;
  data?: {
    sale: SaleData;
    comprobante_url?: string;
  };
  error?: {
    code: string;
    details: string;
  };
}