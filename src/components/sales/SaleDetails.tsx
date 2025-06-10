import React, { useState } from 'react';
import { ShoppingBag, Globe, Smartphone, ShoppingCart, Users, User, Package, Briefcase } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SaleOrigin, ConsumerType } from '../../utils/types';

interface SaleDetailsProps {
  onOriginChange: (origin: SaleOrigin) => void;
  onConsumerTypeChange: (type: ConsumerType) => void;
}

export const SaleDetails: React.FC<SaleDetailsProps> = ({
  onOriginChange,
  onConsumerTypeChange,
}) => {
  const [origin, setOrigin] = useState<SaleOrigin>('Puerta');
  const [consumerType, setConsumerType] = useState<ConsumerType>('minorista');
  
  const handleOriginChange = (newOrigin: SaleOrigin) => {
    setOrigin(newOrigin);
    onOriginChange(newOrigin);
  };
  
  const handleConsumerTypeChange = (newType: ConsumerType) => {
    setConsumerType(newType);
    onConsumerTypeChange(newType);
  };
  
  const originOptions: { value: SaleOrigin; label: string; icon: React.ReactNode }[] = [
    { value: 'Puerta', label: 'Puerta', icon: <ShoppingBag size={18} /> },
    { value: 'Web', label: 'Web', icon: <Globe size={18} /> },
    { value: 'Redes', label: 'Redes Sociales', icon: <Smartphone size={18} /> },
    { value: 'Mercado_libre', label: 'Mercado Libre', icon: <ShoppingCart size={18} /> },
  ];
  
  const consumerOptions: { value: ConsumerType; label: string; icon: React.ReactNode }[] = [
    { value: 'minorista', label: 'Minorista', icon: <User size={18} /> },
    { value: 'mayorista', label: 'Mayorista', icon: <Users size={18} /> },
    { value: 'consumidor_final', label: 'Consumidor Final', icon: <Package size={18} /> },
    { value: 'monotributo', label: 'Monotributo', icon: <Briefcase size={18} /> },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Origen de venta">
        <div className="grid grid-cols-2 gap-2">
          {originOptions.map((option) => (
            <Button
              key={option.value}
              variant={origin === option.value ? 'primary' : 'outline'}
              icon={option.icon}
              onClick={() => handleOriginChange(option.value)}
              fullWidth
            >
              {option.label}
            </Button>
          ))}
        </div>
      </Card>
      
      <Card title="Tipo de consumidor">
        <div className="grid grid-cols-2 gap-2">
          {consumerOptions.map((option) => (
            <Button
              key={option.value}
              variant={consumerType === option.value ? 'primary' : 'outline'}
              icon={option.icon}
              onClick={() => handleConsumerTypeChange(option.value)}
              fullWidth
            >
              {option.label}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};