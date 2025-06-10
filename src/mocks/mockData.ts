import { Customer, Product } from '../utils/types';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    type: 'natural',
    name: 'Juan',
    lastName: 'Pérez',
    document: '12345678',
    phone: '1234567890',
    email: 'juan@example.com',
    address: 'Av. Siempreviva 123'
  },
  {
    id: '2',
    type: 'juridico',
    name: '',
    document: '20-12345678-9',
    businessName: 'Empresa SA',
    phone: '0987654321',
    email: 'contacto@empresa.com',
    address: 'Calle Comercial 456'
  }
];


export const mockSales = [
  {
    id: '1',
    date: '2024-03-20',
    customer: 'Juan Pérez',
    total: 1500,
    status: 'completed',
    items: 3
  },
  {
    id: '2',
    date: '2024-03-19',
    customer: 'Empresa SA',
    total: 2800,
    status: 'completed',
    items: 5
  }
];