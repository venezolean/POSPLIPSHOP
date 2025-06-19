import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
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
    p_nombre_principal,
    p_proveedor_id,
    p_caracteristicas: formattedVariants,
    p_nombre_proveedor,
    p_nombre_ml,
    p_nombre_exportador,
    p_garantia,
    p_unidades_por_paquete,
    p_paquetes_por_caja,
    p_cajas_por_pallet,
    p_foto_url,
    p_rubro,
    p_categoria,
    p_subcategoria,
    p_perecedero,
    p_tiempo_vencimiento,
    p_temporada_venta,
    p_codigo_barras,
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
            <Input label="Nombre para proveedor" value={p_nombre_proveedor} onChange={(e) => setNombreProveedor(e.target.value)} required fullWidth />
            <Input label="Nombre ML" value={p_nombre_ml} onChange={(e) => setNombreML(e.target.value)} required fullWidth />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre exportador" value={p_nombre_exportador} onChange={(e) => setNombreExportador(e.target.value)} required fullWidth />
            <Input label="Código de barras" value={p_codigo_barras} onChange={(e) => setCodigoBarras(e.target.value)} fullWidth />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Unidades por paquete" type="number" value={p_unidades_por_paquete} onChange={(e) => setUnidadesPorPaquete(parseInt(e.target.value))} fullWidth />
            <Input label="Paquetes por caja" type="number" value={p_paquetes_por_caja} onChange={(e) => setPaquetesPorCaja(parseInt(e.target.value))} fullWidth />
            <Input label="Cajas por pallet" type="number" value={p_cajas_por_pallet} onChange={(e) => setCajasPorPallet(parseInt(e.target.value))} fullWidth />
          </div>
          <Input label="Foto URL" value={p_foto_url} onChange={(e) => setFotoUrl(e.target.value)} fullWidth />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Rubro" value={p_rubro} onChange={(e) => setRubro(e.target.value)} fullWidth />
            <Input label="Categoría" value={p_categoria} onChange={(e) => setCategoria(e.target.value)} fullWidth />
            <Input label="Subcategoría" value={p_subcategoria} onChange={(e) => setSubcategoria(e.target.value)} fullWidth />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tiempo de vencimiento (días)" type="number" value={p_tiempo_vencimiento} onChange={(e) => setTiempoVencimiento(parseInt(e.target.value))} fullWidth />
            <Input label="Temporada de venta" value={p_temporada_venta} onChange={(e) => setTemporadaVenta(e.target.value)} fullWidth />
          </div>
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Variantes técnicas</h3>
              <Button onClick={() => setIsVariantsModalOpen(true)} icon={<Plus size={16} />}>Agregar variantes</Button>
            </div>
            {Object.keys(variants).length > 0 ? (
              <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded overflow-auto">
                {JSON.stringify(variants, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay variantes agregadas</p>
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
