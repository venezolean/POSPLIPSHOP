// utils/mappers.ts (o inline en tu componente)
import { VentaRPC, CartItem, PaymentDetail, Customer, SaleOrigin, ConsumerType, PaymentMethod } from './types';

export function mapVentaRPC(v: VentaRPC): {
  items: CartItem[];
  payments: PaymentDetail[];
  customer: Customer;
  origen: SaleOrigin;
  consumerType: ConsumerType;
  estado: string;
  tipo_iva: string;
} {
  const items: CartItem[] = v.detalles.map(d => ({
    id: d.sku,
    sku: d.sku,
    codigo_barras: d.codigo_barras,
    name: d.nombre,
    price: d.precio_unitario,
    editable: false,
    quantity: d.cantidad,
    subtotal: d.cantidad * d.precio_unitario,
  }));

  const payments: PaymentDetail[] = (v.pagos ?? []).map(p => ({
    method: p.metodo as PaymentMethod,
    amount: p.monto,
  }));

  const customer: Customer = {
    id: String(v.cliente_id),
    type: 'natural',
    name: v.cliente_nombre,
    lastName: v.cliente_apellido,
    document: '',
  };

  return {
    items,
    payments,
    customer,
    origen: v.origen,
    consumerType: v.tipo_consumidor,
    estado: v.estado,
    tipo_iva: v.tipo_iva,
  };
}
