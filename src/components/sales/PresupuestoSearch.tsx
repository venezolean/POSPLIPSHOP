import React, { useRef, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { VentaRPC } from '../../utils/types';
import { buscarPresupuestos } from '../../utils/api';

interface PresupuestoSearchProps {
  /**
   * Callback que recibe la venta seleccionada (VentaRPC) desde sugerencias
   */
  onSelect: (venta: VentaRPC) => void;
}

export const PresupuestoSearch: React.FC<PresupuestoSearchProps> = ({ onSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<VentaRPC[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Enfocar input al montar
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Efecto con debounce para llamar buscar_productos
useEffect(() => {
  const term = searchTerm.trim();
  console.log('[PresupuestoSearch] searchTerm cambia a:', term);

  if (term.length < 2) {
    setSuggestions([]);
    return;
  }

  setIsLoading(true);
  const handler = setTimeout(async () => {
    try {
      console.log('[PresupuestoSearch] lanzando buscar_productos para:', term);
      const results = await buscarPresupuestos(term);
      console.log('[PresupuestoSearch] resultados:', results);
      setSuggestions(results);
    } catch (err) {
      console.error('[PresupuestoSearch] error al buscar:', err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  return () => clearTimeout(handler);
}, [searchTerm]);


  // Al seleccionar sugerencia
  const handleSelect = (venta: VentaRPC) => {
    onSelect(venta);
    setSearchTerm('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // Atajo teclado: Enter selecciona primera sugerencia
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div className="relative mb-4">
      <Input
        ref={inputRef}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar presupuesto (ID, cliente…)"
        icon={<Search size={18} />}
        fullWidth
      />

      {isLoading && (
        <div className="absolute z-10 w-full bg-white dark:bg-gray-800 mt-1 p-2 text-sm text-gray-500">
          Buscando...
        </div>
      )}

      {suggestions.length > 0 && !isLoading && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 mt-1 rounded shadow-md max-h-60 overflow-auto">
          {suggestions.map(v => (
            <li
              key={v.id}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
              onClick={() => handleSelect(v)}
            >
              <span>#{v.id} — {v.cliente_nombre} {v.cliente_apellido}</span>
              <span className="text-xs text-gray-500">
                {new Date(v.created_at).toLocaleDateString('es-AR')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
