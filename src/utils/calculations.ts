import { CartItem, Product } from './types';

export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
};

export const calculateTax = (subtotal: number, taxRate: number = 0): number => {
  return subtotal * taxRate;
};

export const calculateTotal = (subtotal: number, discount: number = 0, tax: number = 0): number => {
  return subtotal - discount + tax;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
};

export const updateCartItemSubtotal = (
  item: Product & { quantity: number }
): CartItem => {
  return {
    ...item,
    subtotal: item.price * item.quantity,
  };
};
