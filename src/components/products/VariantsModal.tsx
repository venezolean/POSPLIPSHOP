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
  const [tempUnidadesPorPaquete, setTempUnidadesPorPaquete] = useState<string>('');
  const [tempPaquetesPorCaja, setTempPaquetesPorCaja] = useState<string>('');
  const [tempStockv, setTempStockv] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

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
      nombre: tempNombre || 'Sin nombre',
      precio: tempPrecio || 0,
      codigo_barras: tempCodigoBarras || '',
      link: tempLink || null,
      unidades_por_paquete: tempUnidadesPorPaquete || 1,
      paquetes_por_caja: tempPaquetesPorCaja || 1,
      stockv: tempStockv || 0,
    };
    const valueString = JSON.stringify(fullValue);
    setSelectedVariants(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), valueString]
    }));

    // limpiar campos temporales
    setTempNombre('');
    setTempPrecio('');
    setTempCodigoBarras('');
    setTempLink('');
    setTempUnidadesPorPaquete('');
    setTempPaquetesPorCaja('');
    setTempStockv('');
  };

  const handleRemoveValue = (key: string, index: number) => {
    setSelectedVariants(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(selectedVariants);
    setSelectedVariants({});
    setTempNombre('');
    setTempPrecio('');
    setTempCodigoBarras('');
    setTempLink('');
    setTempUnidadesPorPaquete('');
    setTempPaquetesPorCaja('');
    setTempStockv('');
    setCurrentVariant('');
    onClose();
  };

  const handleCancel = () => {
    setSelectedVariants({});
    setTempNombre('');
    setTempPrecio('');
    setTempCodigoBarras('');
    setTempLink('');
    setTempUnidadesPorPaquete('');
    setTempPaquetesPorCaja('');
    setTempStockv('');
    setCurrentVariant('');
    onClose();
  };

  const footer = (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
      <Button onClick={handleSave}>Guardar variantes</Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Variantes técnicas" footer={footer} size="lg">
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
              ...variantOptions
                .filter(v => !selectedVariants[v.key])
                .map(v => ({ value: v.key, label: v.label }))
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
                <div className="space-y-2">
                  <div className="grid grid 2 md:grid 4 lg:grid 7 gap-2">
                    <Input
                      value={tempNombre}
                      onChange={e => setTempNombre(e.target.value)}
                      placeholder="Característica"
                      required
                    />
                    <Input
                      value={tempPrecio}
                      type="number"
                      onChange={e => setTempPrecio(e.target.value)}
                      placeholder="Precio"
                    />
                    <Input
                      value={tempStockv}
                      type="number"
                      onChange={e => setTempStockv(e.target.value)}
                      placeholder="Stock"
                    />
                  </div>
                  <Button onClick={() => handleAddValue(key)} icon={<Plus size={16} />}>
                    Agregar variante
                  </Button>
                  {selectedVariants[key]?.map((value, index) => (
                    <div key={index} className="flex text-xs items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded w-full h-full">
                      <span className="truncate">{value}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveValue(key, index)}
                        icon={<X size={16} />}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        <div>
          <Button onClick={() => setShowPreview(v => !v)}>
            {showPreview ? 'Ocultar preview' : 'Mostrar preview'}
          </Button>

          {showPreview && Object.keys(selectedVariants).length > 0 && (
            <Card className="p-4 mt-2">
              <h3 className="text-lg font-semibold mb-2">Preview</h3>
              <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded overflow-auto">
                {JSON.stringify(selectedVariants, null, 2)}
              </pre>
            </Card>
          )}
        </div>
      </div>
    </Modal>
  );
};
