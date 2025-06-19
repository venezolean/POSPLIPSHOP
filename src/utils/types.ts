export interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

export type CustomerType = 'natural' | 'juridico';

export interface Customer {
  id: string;
  type: CustomerType;
  name: string;
  lastName?: string;
  document: string; // DNI or CUIT
  businessName?: string; // Razón social
  phone?: string;
  email?: string;
  address?: string;
}

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia';

export interface PaymentDetail {
  method: PaymentMethod;
  amount: number;
}

export type SaleOrigin = 'Puerta' | 'Web' | 'Redes' | 'Mercado_libre';

export type ConsumerType = 'minorista' | 'mayorista' | 'consumidor_final' | 'monotributo';

export interface Sale {
  id: string;
  items: CartItem[];
  customer?: Customer;
  payments: PaymentDetail[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  origin: SaleOrigin;
  consumerType: ConsumerType;
  createdAt: Date;
}


// src/utils/types.ts
export interface ProductoBusqueda {
  id: number | string;
  sku: string;
  codigo_barras: string;
  nombre: string;
  precio: number;
  editable: boolean;
}


export interface Product {
  id: string;
  sku: string;
  codigo_barras: string;
  name: string;
  price: number;
  editable: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

export type FetchSuggestions = (term: string) => Promise<ProductoBusqueda[]>;

export const mapBusquedaAProduct = (p: ProductoBusqueda): Product => ({
  id: String(p.id),
  sku: p.sku,
  codigo_barras: p.codigo_barras,
  name: p.nombre,
  price: p.precio,
  editable: p.editable,
});
// guardar una venta

export type SaleDraft = {
  id: string; // puede ser UUID o un timestamp
  items: CartItem[];
  customer?: Customer;
  payments: PaymentDetail[];
  origin: SaleOrigin;
  consumer: ConsumerType;
  observations: string;
  taxType: string;
};


// Registrar una nueva venta
interface DetalleVenta {
  sku: string;
  cantidad: number;
  precio_unitario: number;
}

interface PagoVenta {
  metodo: string;
  monto: number;
}

export type RegistrarVentaParams = {
  p_cliente_id: number;
  p_origen: string;
  p_tipo_consumidor: string;
  p_tipo_iva: string;
  p_observaciones: string;
  p_detalles: DetalleVenta[];
  p_pagos: PagoVenta[];
  p_user_id: string;
};



// invetario avanzado
export interface InventoryItemAd {
  id: number;
  producto_id: number;
  sku: string;
  caracteristicas: Record<string, any>;
  stock: number;
  precio: number;
  editable: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  nombre: string;
  cod_var_bar: string;
  link: string | null;
  categoria: string;
  subcategoria: string;
  rubro: string;
  temporada_venta: string;
}


//registrar productos


export interface ProductoRegistro {
  p_nombre_principal: string;
  p_proveedor_id: number | null;
  p_caracteristicas: Record<string, string[]>; // corresponde a JSONB
  p_nombre_proveedor: string;
  p_nombre_ml: string;
  p_nombre_exportador: string;
  p_garantia: boolean;
  p_unidades_por_paquete: number;
  p_paquetes_por_caja: number;
  p_cajas_por_pallet: number;
  p_foto_url: string;
  p_rubro: string;
  p_categoria: string;
  p_subcategoria: string;
  p_perecedero: boolean;
  p_tiempo_vencimiento: number;
  p_temporada_venta: string;
  p_codigo_barras: string;
  p_user_id: string; // UUID
}

