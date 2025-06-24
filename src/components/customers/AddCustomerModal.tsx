import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Customer, CustomerType } from '../../utils/types';
import { useAuth } from '../../context/AuthContext';
import { registrarCliente } from '../../utils/api';




interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customer: Customer) => void;
  initialDocument?: string;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onAddCustomer,
  initialDocument = '',
}) => {
  const [customerType, setCustomerType] = useState<CustomerType>('natural');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [document, setDocument] = useState(initialDocument);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const { user } = useAuth();

  const resetForm = () => {
    setCustomerType('natural');
    setName('');
    setLastName('');
    setBusinessName('');
    setDocument(initialDocument);
    setPhone('');
    setEmail('');
    setAddress('');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
const normalizarDocumento = (doc: string) => doc.replace(/\D/g, '');
const normalizarTexto = (text?: string) => text?.trim().toLowerCase() || null;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const docLimpio = normalizarDocumento(document);
  const nuevoEmail = normalizarTexto(email);
  const nuevoNombre = normalizarTexto(name);
  const nuevoApellido = normalizarTexto(lastName);
  const nuevaRazonSocial = normalizarTexto(businessName);
  const nuevoTelefono = phone?.trim() || null;
  const nuevaDireccion = address?.trim() || null;

  let clienteId: number | null = null;
console.log('🚀 Enviando formulario');

if (user?.id) {
  console.log('💾 Registrando en la base de datos...');
  clienteId = await registrarCliente({
    tipo: customerType,
    email: nuevoEmail!,
    nombre: nuevoNombre,
    apellido: nuevoApellido,
    razon_social: nuevaRazonSocial,
    dni: customerType === 'natural' ? docLimpio : null,
    cuit: customerType === 'juridico' ? docLimpio : null,
    telefono: nuevoTelefono,
    direccion: nuevaDireccion,
    created_by: String(user?.id ?? ''),
  });

  if (!clienteId) {
    alert('No se pudo registrar el cliente');
    return;
  }

  // actualizar newCustomer con ID real si querés
}


  const newCustomer: Customer = {
    id: clienteId?.toString() || Date.now().toString(),
    type: customerType,
    name,
    lastName: lastName || undefined,
    document,
    businessName: businessName || undefined,
    phone: phone || undefined,
    email: email || undefined,
    address: address || undefined,
  };

  onAddCustomer(newCustomer);
  resetForm();
};

  
  const footer = (
    <div className="flex justify-end space-x-3">
      <Button variant="outline" onClick={handleClose}>
        Cancelar
      </Button>
      <Button type="submit" form="customer-form">
        Guardar
      </Button>
    </div>
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Agregar cliente"
      footer={footer}
    >
      <form id="customer-form" onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Tipo de cliente"
          value={customerType}
          onChange={(e) => setCustomerType(e.target.value as CustomerType)}
          options={[
            { value: 'natural', label: 'Persona natural' },
            { value: 'juridico', label: 'Persona jurídica' },
          ]}
          fullWidth
        />
        
        {customerType === 'natural' ? (
          <>
            <Input
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <Input
              label="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              fullWidth
            />
            <Input
              label="DNI (opcional)"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              fullWidth
            />
          </>
        ) : (
          <>
            <Input
              label="Razón social"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              fullWidth
            />
            <Input
              label="CUIT"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              required
              fullWidth
            />
          </>
        )}
        
        <Input
          label="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          fullWidth
        />
        
        <Input
          label="Email (opcional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        
        <Input
          label="Dirección (opcional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
        />
        
      </form>
    </Modal>
  );
};