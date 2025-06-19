import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/calculations';
import { InventoryItemAd } from '../../utils/types';


interface EditInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItemAd | null;
  onSave: (updatedItem: InventoryItemAd) => void;
}

export const EditInventoryModal: React.FC<EditInventoryModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
}) => {
  const [precio, setPrecio] = useState(0);
  const [stock, setStock] = useState(0);
  const [codigoBarras, setCodigoBarras] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setPrecio(item.precio);
      setStock(item.stock);
      setCodigoBarras(item.cod_var_bar);
      setErrors({});
    }
  }, [item]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    if (!codigoBarras.trim()) {
      newErrors.codigoBarras = 'El código de barras es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!item || !validateForm()) return;

    const updatedItem: InventoryItemAd = {
      ...item,
      precio,
      stock,
      cod_var_bar: codigoBarras,
      updated_at: new Date().toISOString(),
    };

    onSave(updatedItem);
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const formatCharacteristics = (caracteristicas: Record<string, any>) => {
    return Object.entries(caracteristicas)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join(' | ');
  };

  const getStockBadge = (stockValue: number) => {
    if (stockValue === 0) {
      return <Badge variant="danger" size="sm">Sin Stock</Badge>;
    } else if (stockValue <= 10) {
      return <Badge variant="warning" size="sm">Stock Bajo</Badge>;
    } else {
      return <Badge variant="success" size="sm">En Stock</Badge>;
    }
  };

  const footer = (
    <div className="flex justify-end space-x-3">
      <Button variant="outline" onClick={handleClose}>
        Cancelar
      </Button>
      <Button onClick={handleSave}>
        Guardar Cambios
      </Button>
    </div>
  );

  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar Producto"
      footer={footer}
      size="lg"
    >
      <div className="space-y-6">
        {/* Product Information (Read-only) */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
            Información del Producto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SKU
              </label>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 font-mono">
                {item.sku}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre
              </label>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200">
                {item.nombre}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Características
              </label>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 text-sm">
                {formatCharacteristics(item.caracteristicas)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Precio
              </label>
              <div className="flex items-center">
                {item.editable ? (
                  <Badge variant="info" size="sm">Precio Editable</Badge>
                ) : (
                  <Badge variant="secondary" size="sm">Precio Fijo</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Campos Editables
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Precio"
              type="number"
              value={precio}
              onChange={(e) => setPrecio(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              error={errors.precio}
              fullWidth
            />
            
            <div>
              <Input
                label="Stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                min="0"
                error={errors.stock}
                fullWidth
              />
              <div className="mt-2 flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Estado:</span>
                {getStockBadge(stock)}
              </div>
            </div>
          </div>

          <Input
            label="Código de Barras"
            value={codigoBarras}
            onChange={(e) => setCodigoBarras(e.target.value)}
            error={errors.codigoBarras}
            fullWidth
          />
        </div>

        {/* Preview */}
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-blue-800 dark:text-blue-300 mb-2">
            Vista Previa de Cambios
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Precio:</span>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(precio)}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Stock:</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {stock} unidades
                </span>
                {getStockBadge(stock)}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Código:</span>
              <div className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                {codigoBarras}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
