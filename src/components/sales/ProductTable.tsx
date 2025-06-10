import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { CartItem } from '../../utils/types';
import { formatCurrency, updateCartItemSubtotal } from '../../utils/calculations';

interface ProductTableProps {
  items: CartItem[];
  onUpdateItem: (updatedItem: CartItem) => void;
  onRemoveItem: (itemId: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  items,
  onUpdateItem,
  onRemoveItem,
}) => {
  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItem = {
      ...item,
      quantity: newQuantity,
    };
    
    onUpdateItem(updateCartItemSubtotal(updatedItem));
  };
  
  const handlePriceChange = (item: CartItem, newPrice: number) => {
    if (newPrice < 0) return;
    
    const updatedItem = {
      ...item,
      price: newPrice,
    };
    
    onUpdateItem(updateCartItemSubtotal(updatedItem));
  };
  
  return (
    <Table striped hoverable>
      <TableHead>
        <TableRow>
          <TableCell header>Código</TableCell>
          <TableCell header>Nombre</TableCell>
          <TableCell header align="center">Cantidad</TableCell>
          <TableCell header align="right">Precio Unitario</TableCell>
          <TableCell header align="right">Subtotal</TableCell>
          <TableCell header align="center">Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
              No hay productos agregados
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell align="center">
                <div className="flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="px-2 py-0.5 min-w-8"
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item, parseInt(e.target.value) || 1)}
                    className="w-12 mx-1 text-center rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-0.5"
                    min="1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="px-2 py-0.5 min-w-8"
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </TableCell>
              <TableCell align="right">
                {item.editable ? (
                  <div className="flex items-center justify-end">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handlePriceChange(item, parseFloat(e.target.value) || 0)}
                      className="w-24 text-right rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-0.5 px-2"
                      min="0"
                      step="0.01"
                    />
                  </div>
                ) : (
                  formatCurrency(item.price)
                )}
              </TableCell>
              <TableCell align="right" className="font-semibold">
                {formatCurrency(item.subtotal)}
              </TableCell>
              <TableCell align="center">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-danger-500 hover:text-danger-700 hover:bg-danger-50"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};