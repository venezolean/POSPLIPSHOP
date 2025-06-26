import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Edit, Trash2, Plus, Package, Eye, Printer  } from 'lucide-react';
import { PageLayout } from '../layout/PageLayout';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { EditInventoryModal } from './EditInventoryModal';
import { fetchInventarioAvanzado, fetchOpcionesFiltros, fetchUpsertInventario } from '../../utils/api';
import { InventoryItemAd } from '../../utils/types';
import { useReactToPrint } from 'react-to-print';


export const InventoryPage: React.FC = () => {

  const [inventory, setInventory] = useState<InventoryItemAd[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItemAd | null>(null);
  const [categoria, setCategoria] = useState<string | null>(null);
const [subcategoria, setSubcategoria] = useState<string | null>(null);
const [rubro, setRubro] = useState<string | null>(null);
const [temporada, setTemporada] = useState<string | null>(null);
const [opcionesFiltro, setOpcionesFiltro] = useState<{
  rubros: string[];
  categorias: string[];
  subcategorias: string[];
  temporadas: string[];
}>({
  rubros: [],
  categorias: [],
  subcategorias: [],
  temporadas: []
});

useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, stockFilter, categoria, subcategoria, rubro, temporada]);

// Carga de inventario filtrado
useEffect(() => {
  const timeout = setTimeout(async () => {
    try {
      const data = await fetchInventarioAvanzado(
        searchTerm.trim(),
        stockFilter,
        categoria,
        subcategoria,
        rubro,
        temporada
      );

      setInventory(data);
    } catch (err) {
      console.error('Error cargando inventario:', err);
    }
  }, 300);

  return () => clearTimeout(timeout);
}, [searchTerm, stockFilter, categoria, subcategoria, rubro, temporada, currentPage]);

useEffect(() => {
  const cargarFiltros = async () => {
    try {
    const data = await fetchOpcionesFiltros();
    setOpcionesFiltro(data);
  } catch (err) {
    console.error('Error cargando filtros:', err);
  }
};
  cargarFiltros();
}, []);


  // Pagination logic
const totalItems = inventory.length;
const totalPages = Math.ceil(totalItems / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentItems = inventory.slice(startIndex, endIndex);


  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="danger" size="sm">Sin Stock</Badge>;
    } else if (stock <= 10) {
      return <Badge variant="warning" size="sm">Stock Bajo</Badge>;
    } else {
      return <Badge variant="success" size="sm">En Stock</Badge>;
    }
  };

  const formatCharacteristics = (caracteristicas: Record<string, any>) => {
    return Object.entries(caracteristicas)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join(' | ');
  };

  const handleEdit = (item: InventoryItemAd) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedItem: InventoryItemAd) => {
    setInventory(prev => 
      prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    setSelectedItem(null);
  };

  const handleDelete = (item: InventoryItemAd) => {
    if (confirm(`¿Está seguro de eliminar ${item.nombre}?`)) {
      setInventory(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const handleViewDetails = (item: InventoryItemAd) => {
    alert(`Ver detalles de: ${item.nombre}\n\nCaracterísticas:\n${formatCharacteristics(item.caracteristicas)}`);
  };

const [editingItem, setEditingItem] = useState<{ [id: number]: Partial<InventoryItemAd> }>({});

const handleInlineChange = (id: number, field: keyof InventoryItemAd, value: any) => {
  setEditingItem(prev => ({
    ...prev,
    [id]: {
      ...prev[id],
      [field]: value,
    },
  }));
};

const printRef = useRef<HTMLDivElement>(null);
 const handlePrint = useReactToPrint({
     contentRef: printRef,
   documentTitle: 'Inventario PlipShop',
 });

   
  return (
    <PageLayout title="Inventario">

      <div className="space-y-6">
        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por SKU, nombre o código de barras..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                icon={<Search size={18} />}
                fullWidth
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as 'all' | 'in-stock' | 'low-stock' | 'out-of-stock')}
                options={[
                  { value: 'all', label: 'Todos los productos' },
                  { value: 'in-stock', label: 'En stock' },
                  { value: 'low-stock', label: 'Stock bajo' },
                  { value: 'out-of-stock', label: 'Sin stock' }
                ]}
                icon={<Filter size={18} />}
                fullWidth
              />
            </div>
            <Button
              icon={<Printer size={18} />}
              onClick={handlePrint}
            >
              Imprimir
            </Button>
          </div>
        </Card>




<div className="mt-4 flex flex-wrap gap-4 items-start">
  {(
  [
    // ['Rubro', opcionesFiltro.rubros, rubro, setRubro],
    ['Categoría', opcionesFiltro.categorias, categoria, setCategoria],
    // ['Subcategoría', opcionesFiltro.subcategorias, subcategoria, setSubcategoria],
    ['Temporada', opcionesFiltro.temporadas, temporada, setTemporada]
  ] as [string, string[], string | null, React.Dispatch<React.SetStateAction<string | null>>][]
).map(([label, lista, valor, setter]) => (
  <div key={`filtro-${label}`} className="flex flex-wrap items-center gap-2">
    <strong>{label}:</strong>
    <Button size="sm" variant={!valor ? 'ghost' : 'outline'} onClick={() => setter(null)}>
      Todos
    </Button>
    {lista.map(item => (
      <Button
        key={item}
        size="sm"
        variant={valor === item ? 'ghost' : 'outline'}
        onClick={() => setter(item)}
      >
        {item}
      </Button>
    ))}
  </div>
))
}
</div>









        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{inventory.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-success-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-success-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En Stock</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {inventory.filter(item => item.stock > 10).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-warning-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-warning-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock Bajo</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {inventory.filter(item => item.stock > 0 && item.stock <= 10).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-danger-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-danger-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sin Stock</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {inventory.filter(item => item.stock === 0).length}
                </p>
              </div>
            </div>
          </Card>
        </div>
     
        {/* Inventory Table */}
        <Card>
          <Table striped hoverable>
            <TableHead>
              <TableRow>
                
                <TableCell header>Nombre</TableCell>
                <TableCell header>Características</TableCell>
                <TableCell header align="center">Stock</TableCell>
                <TableCell header align="right">Precio</TableCell>
                <TableCell header>Link</TableCell>
                <TableCell header align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((item) => (
                  <TableRow key={item.id}>
                    
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell className="max-w-xs truncate" >
                      {formatCharacteristics(item.caracteristicas)}
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className="font-semibold"><input
                        type="number"
                        defaultValue={item.stock}
                        className="w-16 text-center border rounded px-1 py-0.5"
                        onChange={(e) =>
                            handleInlineChange(item.id, 'stock', Number(e.target.value))
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                            const itemToUpdate = editingItem[item.id];
                            if (itemToUpdate) fetchUpsertInventario({ id: item.id, ...itemToUpdate });
                            }
                        }}
                        onBlur={() => {
                            const itemToUpdate = editingItem[item.id];
                            if (itemToUpdate) fetchUpsertInventario({ id: item.id, ...itemToUpdate });
                        }}
                        /></span>
                        {getStockBadge(item.stock)}
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex flex-col items-end">
                        <span className="font-semibold"><input
                            type="number"
                            defaultValue={item.precio}
                            className="w-20 text-right border rounded px-1 py-0.5"
                            onChange={(e) =>
                                handleInlineChange(item.id, 'precio', Number(e.target.value))
                            }
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                const itemToUpdate = editingItem[item.id];
                                if (itemToUpdate) fetchUpsertInventario({ id: item.id, ...itemToUpdate });
                                }
                            }}
                            onBlur={() => {
                                const itemToUpdate = editingItem[item.id];
                                if (itemToUpdate) fetchUpsertInventario({ id: item.id, ...itemToUpdate });
                            }}
                            /></span>
                        {item.editable && (
                          <Badge variant="info" size="sm">Editable</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      <input
                        type="text"
                        defaultValue={item.link ?? ''}
                        className="w-20 text-right border rounded px-1 py-0.5"
                        onChange={(e) =>
                          handleInlineChange(item.id, 'link', e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const itemToUpdate = editingItem[item.id];
                            if (itemToUpdate) fetchUpsertInventario({ id: item.id, ...itemToUpdate });
                          }
                        }}
                        onBlur={() => {
                          const itemToUpdate = editingItem[item.id];
                          if (itemToUpdate) fetchUpsertInventario({ id: item.id, ...itemToUpdate });
                        }}
                      />
                    </TableCell>
                    
                    <TableCell align="center">
                      <div className="flex justify-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(item)}
                          className="text-primary-600 hover:text-primary-800"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(item)}
                          className="text-warning-600 hover:text-warning-800"
                          title="Editar producto"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item)}
                          className="text-danger-600 hover:text-danger-800"
                          title="Eliminar producto"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                Mostrando {startIndex + 1} a {Math.min(endIndex, inventory.length)} de {inventory.length} productos
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

{/* Contenedor printable */}
     <div style={{ display: 'none' }}>
     <div ref={printRef} >

        <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gray-100">
        <th className="border px-2 py-1 text-left">Nombre</th>
        <th className="border px-2 py-1 text-center">Stock</th>
        <th className="border px-2 py-1 text-right">Precio</th>
        <th className="border px-2 py-1 text-left">Link</th>
      </tr>
    </thead>
    <tbody>
      {inventory.map(item => (
        <tr key={item.id}>
          <td className="border px-2 py-1">{item.nombre}</td>
          <td className="border px-2 py-1 text-center">{item.stock}</td>
          <td className="border px-2 py-1 text-right">{item.precio}</td>
          <td className="border px-2 py-1">
            {item.link ? (
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.link}
              </a>
            ) : (
              '—'
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>


      {/* Edit Modal */}
      <EditInventoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSave={handleSaveEdit}
      />
    </PageLayout>
  );
};