import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { variantOptions, VariantOption } from './variant-options';

interface VariantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (variants: Record<string, string[]>) => void;
}

export const VariantsModal: React.FC<VariantsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string[]>>({});
  const [currentVariant, setCurrentVariant] = useState<string>('');
  const [tempNombre, setTempNombre] = useState<string>('');
  const [tempPrecio, setTempPrecio] = useState<string>('');
  const [tempCodigoBarras, setTempCodigoBarras] = useState<string>('');
  const [tempLink, setTempLink] = useState<string>('');

  const handleAddVariant = (variant: VariantOption) => {
    if (selectedVariants[variant.key]) return;
    setSelectedVariants(prev => ({ ...prev, [variant.key]: [] }));
    setCurrentVariant(variant.key);
  };

  const handleRemoveVariant = (key: string) => {
    const { [key]: removed, ...rest } = selectedVariants;
    setSelectedVariants(rest);
  };

  const handleAddValue = (key: string) => {
    if (!tempNombre.trim()) return;
    const fullValue = {
      nombre: tempNombre,
      precio: tempPrecio,
      codigo_barras: tempCodigoBarras,
      link: tempLink
    };
    const valueString = JSON.stringify(fullValue);
    setSelectedVariants(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), valueString]
    }));

    setTempNombre('');
    setTempPrecio('');
    setTempCodigoBarras('');
    setTempLink('');
  };

  const handleRemoveValue = (key: string, index: number) => {
    setSelectedVariants(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  };

  const renderVariantInput = (variant: VariantOption) => {
    return (
      <div className="space-y-2">
        <div className="grid grid 1 md:grid 2 lg:grid 4 gap-2">
          <Input
            value={tempNombre}
            onChange={(e) => setTempNombre(e.target.value)}
            placeholder="Nombre"
          />
          <Input
            value={tempPrecio}
            type="number"
            onChange={(e) => setTempPrecio(e.target.value)}
            placeholder="Precio"
          />
          <Input
            value={tempCodigoBarras}
            onChange={(e) => setTempCodigoBarras(e.target.value)}
            placeholder="Código de barras"
          />
          <Input
            value={tempLink}
            onChange={(e) => setTempLink(e.target.value)}
            placeholder="Link"
          />
        </div>
        <Button
          onClick={() => handleAddValue(variant.key)}
          icon={<Plus size={16} />}
        >
          Agregar variante
        </Button>
        {selectedVariants[variant.key]?.map((value, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <span>{value}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveValue(variant.key, index)}
              icon={<X size={16} />}
            />
          </div>
        ))}
      </div>
    );
  };

  const handleSave = () => {
    onSave(selectedVariants);
    onClose();
  };

  const footer = (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onClose}>Cancelar</Button>
      <Button onClick={handleSave}>Guardar variantes</Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Variantes técnicas" footer={footer} size="lg">
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Select
            value={currentVariant}
            onChange={(e) => {
              const variant = variantOptions.find(v => v.key === e.target.value);
              if (variant) handleAddVariant(variant);
            }}
            options={[
              { value: '', label: 'Seleccionar variante...' },
              ...variantOptions.filter(v => !selectedVariants[v.key]).map(v => ({ value: v.key, label: v.label }))
            ]}
          />
        </div>

        <div className="space-y-4">
          {Object.keys(selectedVariants).map(key => {
            const variant = variantOptions.find(v => v.key === key);
            if (!variant) return null;

            return (
              <Card key={key} className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{variant.label}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveVariant(key)}
                    icon={<X size={16} />}
                  />
                </div>
                {renderVariantInput(variant)}
              </Card>
            );
          })}
        </div>

        {Object.keys(selectedVariants).length > 0 && (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded overflow-auto">
              {JSON.stringify(selectedVariants, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </Modal>
  );
};
