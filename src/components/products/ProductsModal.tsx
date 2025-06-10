import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { Package, Plus } from 'lucide-react';
import { VariantsModal } from './VariantsModal';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({ isOpen, onClose }) => {
  const [isVariantsModalOpen, setIsVariantsModalOpen] = useState(false);
  const [variants, setVariants] = useState<Record<string, string[]>>({});
  
  const handleSaveVariants = (newVariants: Record<string, string[]>) => {
    setVariants(newVariants);
    setIsVariantsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Product data with variants:', variants);
  };

  const footer = (
    <div className="flex justify-end space-x-3">
      <Button variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <Button type="submit" form="product-form">
        Guardar producto
      </Button>
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Nuevo Producto"
        footer={footer}
        size="lg"
      >
        <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="SKU"
              required
              fullWidth
            />
            <Input
              label="Código de barras"
              fullWidth
            />
          </div>

          <Input
            label="Nombre del producto"
            required
            fullWidth
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Precio"
              type="number"
              required
              fullWidth
            />
            <Select
              label="Categoría"
              options={[
                { value: 'category1', label: 'Categoría 1' },
                { value: 'category2', label: 'Categoría 2' },
              ]}
              required
              fullWidth
            />
          </div>

          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Variantes técnicas</h3>
              <Button
                onClick={() => setIsVariantsModalOpen(true)}
                icon={<Plus size={16} />}
              >
                Agregar variantes
              </Button>
            </div>

            {Object.keys(variants).length > 0 ? (
              <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded overflow-auto">
                {JSON.stringify(variants, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No hay variantes agregadas
              </p>
            )}
          </Card>
        </form>
      </Modal>

      <VariantsModal
        isOpen={isVariantsModalOpen}
        onClose={() => setIsVariantsModalOpen(false)}
        onSave={handleSaveVariants}
      />
    </>
  );
};