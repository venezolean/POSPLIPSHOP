import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { variantOptions, VariantOption } from './variant-options'


interface VariantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (variants: Record<string, string[]>) => void;
}

export const VariantsModal: React.FC<VariantsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string[]>>({});
  const [currentVariant, setCurrentVariant] = useState<string>('');
  const [tempValue, setTempValue] = useState<string>('');
  const [tempUnit, setTempUnit] = useState<string>('');

  const handleAddVariant = (variant: VariantOption) => {
    if (selectedVariants[variant.key]) return;
    setSelectedVariants(prev => ({ ...prev, [variant.key]: [] }));
    setCurrentVariant(variant.key);
  };

  const handleRemoveVariant = (key: string) => {
    const { [key]: removed, ...rest } = selectedVariants;
    setSelectedVariants(rest);
  };

  const handleAddValue = (key: string, value: string) => {
    if (!value.trim()) return;
    setSelectedVariants(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), value]
    }));
    setTempValue('');
    setTempUnit('');
  };

  const handleRemoveValue = (key: string, index: number) => {
    setSelectedVariants(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  };

  const renderVariantInput = (variant: VariantOption) => {
    switch (variant.type) {
      case 'multi-select':
        return (
          <div className="space-y-2">
            {variant.options?.map((option) => (
              <label key={option.toString()} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedVariants[variant.key]?.includes(option.toString())}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleAddValue(variant.key, option.toString());
                    } else {
                      handleRemoveValue(variant.key, selectedVariants[variant.key].indexOf(option.toString()));
                    }
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'text-array':
        return (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder={`Agregar ${variant.label.toLowerCase()}`}
                onKeyDown={(e) => e.key === 'Enter' && handleAddValue(variant.key, tempValue)}
              />
              <Button
                onClick={() => handleAddValue(variant.key, tempValue)}
                icon={<Plus size={16} />}
              >
                Agregar
              </Button>
            </div>
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

      case 'number-with-unit':
        return (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                type="number"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder="Valor"
                className="w-24"
              />
              <Input
                value={tempUnit}
                onChange={(e) => setTempUnit(e.target.value)}
                placeholder="Unidad"
                className="w-24"
              />
              <Button
                onClick={() => handleAddValue(variant.key, `${tempValue} ${tempUnit}`)}
                icon={<Plus size={16} />}
              >
                Agregar
              </Button>
            </div>
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

      case 'select':
        return (
          <Select
            value={tempValue}
            onChange={(e) => {
              setTempValue(e.target.value);
              handleAddValue(variant.key, e.target.value);
            }}
            options={variant.options?.map(opt => ({
              value: opt.toString(),
              label: opt.toString()
            })) || []}
          />
        );

      default:
        return (
          <div className="flex space-x-2">
            <Input
              type={variant.type === 'number' ? 'number' : 'text'}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={`Ingrese ${variant.label.toLowerCase()}`}
              onKeyDown={(e) => e.key === 'Enter' && handleAddValue(variant.key, tempValue)}
            />
            <Button
              onClick={() => handleAddValue(variant.key, tempValue)}
              icon={<Plus size={16} />}
            >
              Agregar
            </Button>
          </div>
        );
    }
  };

  const handleSave = () => {
    onSave(selectedVariants);
    onClose();
  };

  const footer = (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <Button onClick={handleSave}>
        Guardar variantes
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Variantes técnicas"
      footer={footer}
      size="lg"
    >
      <div className="space-y-4">
        {/* Selector de variante */}
        <div className="flex space-x-2">
          <Select
            value={currentVariant}
            onChange={(e) => {
              const variant = variantOptions.find(v => v.key === e.target.value);
              if (variant) handleAddVariant(variant);
            }}
            options={[
              { value: '', label: 'Seleccionar variante...' },
              ...variantOptions
                .filter(v => !selectedVariants[v.key])
                .map(v => ({ value: v.key, label: v.label }))
            ]}
          />
        </div>

        {/* Variantes seleccionadas */}
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

        {/* Preview del JSON */}
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