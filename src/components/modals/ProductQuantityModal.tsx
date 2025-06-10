import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Product } from '../../utils/types';
import { formatCurrency } from '../../utils/calculations';

interface ProductQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: (quantity: number, price?: number) => void;
}

export const ProductQuantityModal: React.FC<ProductQuantityModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(product.price);
  const quantityInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen && quantityInputRef.current) {
      quantityInputRef.current.focus();
      quantityInputRef.current.select();
    }
  }, [isOpen]);
  
  useEffect(() => {
    setPrice(product.price);
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToCart(quantity, price);
  };

  const footer = (
    <div className="flex justify-end space-x-3">
      <Button variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <Button onClick={() => onAddToCart(quantity, price)}>
        Agregar al carrito
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar producto"
      description={`${product.name} (${product.sku})`}
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          ref={quantityInputRef}
          label="Cantidad"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          min="1"
          required
          fullWidth
        />
        
        {product.isEditable && (
          <Input
            label="Precio unitario"
            type="number"
            value={price}
            onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
            min="0"
            step="0.01"
            required
            fullWidth
          />
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
            <span className="font-semibold text-lg text-gray-800 dark:text-white">
              {formatCurrency(quantity * price)}
            </span>
          </div>
        </div>
      </form>
    </Modal>
  );
};