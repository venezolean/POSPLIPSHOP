import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { AddCustomerModal } from './AddCustomerModal';
import { Customer } from '../../utils/types';
import { CustomerSearch } from './CustomerSearch';

interface CustomersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomersModal: React.FC<CustomersModalProps> = ({ isOpen, onClose }) => {

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleClose = () => {
    setResetTrigger((prev) => prev + 1);
    onClose();
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
          <CustomerSearch
            resetTrigger={resetTrigger}
            onSelectCustomer={(customer) => {
              if (customer) {
                setSelectedCustomer(customer);
                setShowCustomerForm(true);
              } else {
                setSelectedCustomer(null);
                setShowCustomerForm(false);
                setIsAddCustomerModalOpen(true);
              }
            }}
          />


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
      />
    </>
  );
};