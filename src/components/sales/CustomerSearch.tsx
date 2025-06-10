import React, { useRef, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Customer } from '../../utils/types';

interface CustomerSearchProps {
  onSelectCustomer: (customer: Customer | undefined) => void;
  customers: Customer[];
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({ onSelectCustomer, customers }) => {
  const [documentNumber, setDocumentNumber] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  
  const searchCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentNumber.trim()) return;
    
    const foundCustomer = customers.find(
      (c) => c.document.replace(/[^0-9]/g, '') === documentNumber.replace(/[^0-9]/g, '')
    );
    
    if (foundCustomer) {
      setSelectedCustomer(foundCustomer);
      onSelectCustomer(foundCustomer);
    } else {
      setSelectedCustomer(undefined);
      onSelectCustomer(undefined);
      if (confirm('Cliente no encontrado. ¿Desea agregar un nuevo cliente?')) {
        // Handle new customer
      }
    }
  };
  
  const clearCustomer = () => {
    setSelectedCustomer(undefined);
    onSelectCustomer(undefined);
    setDocumentNumber('');
  };
  
  return (
    <div>
      {!selectedCustomer ? (
        <form onSubmit={searchCustomer} className="flex gap-1">
          <Input
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            placeholder="DNI/CUIT"
            icon={<Search size={14} />}
            className="text-xs py-1"
            fullWidth
          />
        </form>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 p-1 rounded text-xs flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-medium">
              {selectedCustomer.type === 'natural' 
                ? `${selectedCustomer.name} ${selectedCustomer.lastName}`
                : selectedCustomer.businessName}
            </span>
            <span className="text-gray-500 text-[10px]">
              {selectedCustomer.type === 'natural' ? 'DNI: ' : 'CUIT: '}
              {selectedCustomer.document}
            </span>
          </div>
          <button 
            onClick={clearCustomer}
            className="text-gray-500 hover:text-gray-700 text-xs ml-2"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};