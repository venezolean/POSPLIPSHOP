import React, { useRef, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Product, CartItem } from '../../utils/types';
import { updateCartItemSubtotal } from '../../utils/calculations';
import { fetchSuggestions } from '../../utils/api'; // 💡 nueva importación
import { ProductoBusqueda, mapBusquedaAProduct } from '../../utils/types';

interface ProductSearchProps {
  onAddToCart: (item: CartItem) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ onAddToCart }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const term = searchTerm.trim();
      if (term.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
const productos = await fetchSuggestions(term);
console.log('Resultados de búsqueda:', productos);
const productosMapeados = productos.map(mapBusquedaAProduct);
setSuggestions(productosMapeados);
      setIsLoading(false);
    }, 300); // Debounce para evitar demasiadas llamadas

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSelect = (product: Product) => {
  const cartItem: CartItem = updateCartItemSubtotal({
    ...product,
    quantity: 1,
    price: product.price,
  });
  onAddToCart(cartItem);
  setSearchTerm('');
  setSuggestions([]);
  inputRef.current?.focus();
};


const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    e.preventDefault();

    // Pequeño delay para asegurar que se haya completado la lectura
    setTimeout(() => {
      if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    }, 400); // 100ms suele ser suficiente
  }
};



  return (
    <div className="relative mb-6">
      <Input
        ref={inputRef}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ingrese SKU, código de barras o nombre"
        icon={<Search size={18} />}
        fullWidth
        className="text-lg py-3"
      />

      {isLoading && (
        <div className="absolute z-10 w-full bg-white dark:bg-gray-800 mt-1 p-2 text-sm text-gray-500">
          Buscando productos...
        </div>
      )}

      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 mt-1 rounded shadow-md max-h-60 overflow-auto">
          {suggestions.map((p) => (
            <li
              key={p.id}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleSelect(p)}
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
