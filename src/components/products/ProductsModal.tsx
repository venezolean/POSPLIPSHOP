import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Plus } from 'lucide-react';
import { VariantsModal } from './VariantsModal';
import { useAuth } from '../../context/AuthContext';
import { ProductoRegistro } from '../../utils/types';
import { registrarProducto } from '../../utils/api';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

 // ahora: claves (value) en minúsculas y mapping a categorías permitidas
 const rubros = [
   'logistica',
   'papeleria',
   'hogar_cuidado_personal',
   'deporte_y_bienestar',
   'otros',
   'kit'
 ];

 const categoriasPorRubro: Record<string, string[]> = {
   logistica: ['Embalaje'],
   papeleria: ['Papeleria Oficina', 'Encuadernacion'],
   hogar_cuidado_personal: ['Blanqueria', 'Higiene', 'Hogar',' Perfumeria'],
   deporte_y_bienestar: ['Yoga y Fitness'],
   otros: ['Otros'],
 };
const tempdevent =['Todo el año', 'Otoño', 'Verano','Primavera','Invierno','Festividades' ];

export const NewProductModal: React.FC<NewProductModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isVariantsModalOpen, setIsVariantsModalOpen] = useState(false);
  const [variants, setVariants] = useState<Record<string, string[]>>({});

  const [p_nombre_principal, setNombrePrincipal] = useState('');
  const [p_proveedor_id, setProveedorId] = useState<number | null>(null);
  const [p_nombre_proveedor, setNombreProveedor] = useState('');
  const [p_nombre_ml, setNombreML] = useState('');
  const [p_nombre_exportador, setNombreExportador] = useState('');
  const [p_garantia, setGarantia] = useState(false);
  const [p_unidades_por_paquete, setUnidadesPorPaquete] = useState(1);
  const [p_paquetes_por_caja, setPaquetesPorCaja] = useState(1);
  const [p_cajas_por_pallet, setCajasPorPallet] = useState(1);
  const [p_foto_url, setFotoUrl] = useState('');
  const [p_rubro, setRubro] = useState('');
  const [p_categoria, setCategoria] = useState('');
  const [p_subcategoria, setSubcategoria] = useState('');
  const [p_perecedero, setPerecedero] = useState(false);
  const [p_tiempo_vencimiento, setTiempoVencimiento] = useState(0);
  const [p_temporada_venta, setTemporadaVenta] = useState('');
  const [p_codigo_barras, setCodigoBarras] = useState('');

  const handleSaveVariants = (newVariants: Record<string, string[]>) => {
    setVariants(newVariants);
    setIsVariantsModalOpen(false);
  };

 // Cuando cambie el rubro, reseteamos la categoría
 useEffect(() => {
   setCategoria('');
 }, [p_rubro]);

 // Listado filtrado según rubro seleccionado
 const categoriasDisponibles = p_rubro
   ? categoriasPorRubro[p_rubro] || []
   : [];



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formattedVariants: Record<string, any[]> = {};
  for (const key in variants) {
    formattedVariants[key] = variants[key].map((item) => {
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    });
  }

  const data: ProductoRegistro = {
  p_nombre_principal: p_nombre_principal?.trim() || 'Sin nombre',
  p_proveedor_id: p_proveedor_id ?? 1,
  p_caracteristicas: formattedVariants ?? {},
  p_nombre_proveedor: p_nombre_proveedor || p_nombre_principal || 'Sin nombre',
  p_nombre_ml: p_nombre_ml || p_nombre_principal || 'Sin nombre',
  p_nombre_exportador: p_nombre_exportador || p_nombre_principal || 'Sin nombre',
  p_garantia: p_garantia || false,
  p_unidades_por_paquete: p_unidades_por_paquete ?? 1,
  p_paquetes_por_caja: p_paquetes_por_caja ?? 1,
  p_cajas_por_pallet: p_cajas_por_pallet ?? 1,
  p_foto_url: p_foto_url || '',
  p_rubro: p_rubro || '',
  p_categoria: p_categoria || '',
  p_subcategoria: p_subcategoria || '',
  p_perecedero: p_perecedero ?? false,
  p_tiempo_vencimiento: p_tiempo_vencimiento ?? 0,
  p_temporada_venta: p_temporada_venta || '',
  p_codigo_barras: p_codigo_barras || `${p_nombre_principal?.trim().toLowerCase().replace(/\s+/g, '-')}-${Math.floor(1000 + Math.random() * 9000)}`,
  p_user_id: String(user?.id ?? '')
};


  const id = await registrarProducto(data);

  if (id) {
    console.log('Producto registrado con ID:', id);
    resetForm();
    onClose(); // cerrar modal
    // podés resetear los campos si querés
  } else {
    console.error('No se pudo registrar el producto.');
    alert ('No se pudo registrar el producto todos los campos deben estar llenos.')
  }
};

const handleClose = () => {
  resetForm();
  onClose();
};


const resetForm = () => {
  setNombrePrincipal('');
  setProveedorId(null);
  setNombreProveedor('');
  setNombreML('');
  setNombreExportador('');
  setGarantia(false);
  setUnidadesPorPaquete(1);
  setPaquetesPorCaja(1);
  setCajasPorPallet(1);
  setFotoUrl('');
  setRubro('');
  setCategoria('');
  setSubcategoria('');
  setPerecedero(false);
  setTiempoVencimiento(0);
  setTemporadaVenta('');
  setCodigoBarras('');
  setVariants({});
};



  const footer = (
    <div className="flex justify-end space-x-3">
      <Button variant="outline" onClick={handleClose}>
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
        onClose={handleClose}
        title="Nuevo Producto"
        footer={footer}
        size="lg"
      >
        <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nombre del producto" value={p_nombre_principal} onChange={(e) => setNombrePrincipal(e.target.value)} required fullWidth />
      <div className="grid grid-cols-2 gap-4">
            {/* Rubro */}
            <div className="flex flex-col">
              <label htmlFor="rubro" className="mb-1 text-sm font-medium text-gray-700">
                Rubro
              </label>
              <select
                id="rubro"
                value={p_rubro}
                onChange={e => setRubro(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="" disabled>
                  — Seleccioná un rubro —
                </option>
                {rubros.map(r => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Categoría dependiente */}
            <div className="flex flex-col">
              <label htmlFor="categoria" className="mb-1 text-sm font-medium text-gray-700">
                Categoría
              </label>
              <select
                id="categoria"
                value={p_categoria}
                onChange={e => setCategoria(e.target.value)}
                disabled={!p_rubro}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="" disabled>— Seleccioná una categoría —</option>
                {categoriasDisponibles.map(c => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tiempo de vencimiento (días)" type="number" value={p_tiempo_vencimiento} onChange={(e) => setTiempoVencimiento(parseInt(e.target.value))} fullWidth />
            {/* Temporada de venta */}
            <div className="flex flex-col">
              <label htmlFor="temporada_venta" className="mb-1 text-sm font-medium text-gray-700">
                Temporada de Venta
              </label>
              <select
                id="temporada_venta"
                value={p_temporada_venta}
                onChange={e => setTemporadaVenta(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="" disabled>
                  — Seleccioná una categoría —
                </option>
                {tempdevent.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Variantes técnicas</h3>
              <Button onClick={() => setIsVariantsModalOpen(true)} icon={<Plus size={16} />}>Agregar variantes</Button>
            </div>
            {Object.entries(variants).flatMap(([key, values]) =>
              values.map((raw, i) => {
                const { nombre } = JSON.parse(raw);
                return (
                  <span
                    key={`${key}-${i}`}
                    className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-sm px-3 py-1 rounded-full"
                  >
                    {nombre}
                  </span>
                );
              })
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
