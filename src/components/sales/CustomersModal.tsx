import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Search, UserPlus } from 'lucide-react';
import { AddCustomerModal } from '../modals/AddCustomerModal';
import { Customer } from '../../utils/types';

interface CustomersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomersModal: React.FC<CustomersModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock customer search
    const mockCustomer = {
      id: '1',
      type: 'natural' as const,
      name: 'Juan',
      lastName: 'Pérez',
      document: '12345678',
      email: 'juan@example.com',
      phone: '1234567890',
    };

    if (searchTerm === '12345678') {
      setSelectedCustomer(mockCustomer);
      setShowCustomerForm(true);
    } else {
      setSelectedCustomer(null);
      setShowCustomerForm(false);
      alert('Cliente no encontrado. ¿Desea registrarlo?');
      setIsAddCustomerModalOpen(true);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Gestión de Clientes"
        size="lg"
      >
        <div className="space-y-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              placeholder="Buscar por DNI/CUIT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
              fullWidth
            />
            <Button type="submit">Buscar</Button>
            <Button
              variant="outline"
              onClick={() => setIsAddCustomerModalOpen(true)}
              icon={<UserPlus size={18} />}
            >
              Nuevo Cliente
            </Button>
          </form>

          {showCustomerForm && selectedCustomer && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Datos del Cliente</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  value={selectedCustomer.name}
                  readOnly
                  fullWidth
                />
                <Input
                  label="Apellido"
                  value={selectedCustomer.lastName || ''}
                  readOnly
                  fullWidth
                />
                <Input
                  label="Documento"
                  value={selectedCustomer.document}
                  readOnly
                  fullWidth
                />
                <Input
                  label="Email"
                  value={selectedCustomer.email || ''}
                  readOnly
                  fullWidth
                />
                <Input
                  label="Teléfono"
                  value={selectedCustomer.phone || ''}
                  readOnly
                  fullWidth
                />
              </div>
            </div>
          )}
        </div>
      </Modal>

      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        onAddCustomer={(customer) => {
          console.log('New customer:', customer);
          setIsAddCustomerModalOpen(false);
        }}
        initialDocument={searchTerm}
      />
    </>
  );
};