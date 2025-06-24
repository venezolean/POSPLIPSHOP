import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { ProductSearch } from './ProductSearch';
import { ProductTable } from './ProductTable';
import { PaymentMethods } from './PaymentMethods';
import { CustomerSearch } from '../customers/CustomerSearch';
import { Card } from '../ui/Card';
import { Save, Printer, RefreshCw, ShoppingBag, Globe, Smartphone, ShoppingCart, User, Users, Package, Briefcase } from 'lucide-react';
import { Button } from '../ui/Button';
import { CartItem, Customer, SaleDraft, PaymentDetail, SaleOrigin, ConsumerType } from '../../utils/types';
import { calculateSubtotal, calculateTax, calculateTotal, formatCurrency } from '../../utils/calculations';
import { useAuth } from '../../context/AuthContext';
import { registrarVenta } from '../../utils/api';
import { saveDraft, deleteDraft, getDrafts } from '../../utils/draft';
import { v4 as uuidv4 } from 'uuid';
import { useReactToPrint } from 'react-to-print'
import logo from './img/Plip.png';



interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | undefined>();
  const [payments, setPayments] = useState<PaymentDetail[]>([]);
  const [saleOrigin, setSaleOrigin] = useState<SaleOrigin>('Puerta');
  const [consumerType, setConsumerType] = useState<ConsumerType>('minorista');
  const [observations, setObservations] = useState('');
  const [taxType, setTaxType] = useState('sin_iva');
  const [resetKey, setResetKey] = useState(0);
  const [drafts, setDrafts] = useState<SaleDraft[]>([]);
  const [estadoVenta, setEstadoVenta] = useState('entregado'); // o 'pagado' si querés mantener el valor por defecto


  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [mostrar, setMostrar] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSubtotal = calculateSubtotal(cartItems);
    const newTax = calculateTax(newSubtotal);
    const newTotal = calculateTotal(newSubtotal, discount, newTax);
    
    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  }, [cartItems, discount]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    if (e.key === 'Enter') {
      handleSaveSale();
    } else if (e.key.toLowerCase() === 'n') {
      handleReset();
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleAddToCart = (item: CartItem) => {
    const existingIndex = cartItems.findIndex((i) => i.id === item.id);
    
    if (existingIndex !== -1) {
      const updatedItems = [...cartItems];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + item.quantity,
        subtotal: (updatedItems[existingIndex].price * (updatedItems[existingIndex].quantity + item.quantity)),
      };
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, item]);
    }
  };

const handleSaveSale = async () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
    alert('Debés agregar al menos un producto.');
    return;
  }

  // Solo validar pagos si es una venta normal (entregado)
  const totalPagado = payments.reduce((sum, p) => sum + p.amount, 0);
  if (estadoVenta === 'entregado' && totalPagado < total) {
    alert('El monto pagado no cubre el total de la venta.');
    return;
  }


  const ventaParams = {
    p_cliente_id: customer ? Number(customer.id) : 1,
    p_origen: saleOrigin,
    p_tipo_consumidor: consumerType,
    p_tipo_iva: taxType,
    p_observaciones: estadoVenta,
    p_detalles: cartItems.map((item) => ({
    sku: item.sku,              // <-- asegurate que cartItems tengan sku
    cantidad: item.quantity,
    precio_unitario: item.price,
  })),
  p_pagos: payments.map((p) => ({
      metodo: p.method,
      monto: p.amount,
  })),
  p_user_id: String(user?.id ?? ''),
};

const ventaId = await registrarVenta(ventaParams);

  if (ventaId) {
    alert(`Venta registrada correctamente. ID: ${ventaId}`);
    handleReset();
  } else {
    alert('Hubo un error al registrar la venta.');
  }


// Mostrar en consola el objeto listo para enviar
  console.log('Objeto ventaParams a enviar:', ventaParams);
  
};

const handleSaveDraft = () => {
  if (cartItems.length === 0) {
    alert('No podés guardar un borrador vacío.');
    return;
  }

  const draft: SaleDraft = {
    id: uuidv4(),
    items: cartItems,
    customer,
    payments,
    origin: saleOrigin,
    consumer: consumerType,
    observations,
    taxType,
  };

  saveDraft(draft);
  setDrafts(getDrafts()); 
  alert('Borrador guardado con éxito');
};

useEffect(() => {
  setDrafts(getDrafts());
}, [isOpen]);

const handleLoadDraft = (draft: SaleDraft) => {
  setCartItems(draft.items);
  setCustomer(draft.customer);
  setPayments(draft.payments);
  setSaleOrigin(draft.origin);
  setConsumerType(draft.consumer);
  setObservations(draft.observations);
  setTaxType(draft.taxType);
  setMostrar(true);
};



const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Presupuesto PlipShop',
    
  })


  const handleReset = () => {
    setCartItems([]);
    setCustomer(undefined);
    setPayments([]);
    setSaleOrigin('Puerta');
    setConsumerType('minorista');
    setObservations('');
    setDiscount(0);
    setPayments([]);
    setResetKey(prev => prev + 1); // fuerza reinicio interno

  };

  const originOptions = [
    { value: 'Puerta', label: 'Puerta', icon: <ShoppingBag size={18} /> },
    { value: 'Web', label: 'Web', icon: <Globe size={18} /> },
    { value: 'Redes', label: 'Redes', icon: <Smartphone size={18} /> },
    { value: 'Mercado_libre', label: 'ML', icon: <ShoppingCart size={18} /> },
  ];

  const consumerOptions = [
    { value: 'minorista', label: 'Minorista', icon: <User size={18} /> },
    { value: 'mayorista', label: 'Mayorista', icon: <Users size={18} /> },
    { value: 'consumidor_final', label: 'Final', icon: <Package size={18} /> },
    { value: 'monotributo', label: 'Monotributo', icon: <Briefcase size={18} /> },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Venta"
      size="full"
    >
      <div className="h-full flex flex-col space-y-2">
        {/* Header with Company and Customer Info */}
        <div className="flex justify-between items-start space-x-4">
          <div className="text-gray-700 dark:text-gray-300 text-xs">
            <h2 className="font-bold">Plipshop</h2>
            <p className="text-xs">Av. Jujuy 50</p>
          </div>
          <div className="w-1/3">
            <CustomerSearch onSelectCustomer={setCustomer} resetTrigger={resetKey}  // <— aquí
 />
          </div>
        </div>

        {/* Sale Options and Payment Methods */}
        <div className="flex gap-2">
          
        <Button
          onClick={() => setMostrar(!mostrar)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {mostrar ? "Ocultar" : "Mostrar"}
        </Button>
          {mostrar && (
          
          <>
          {/* Sale Origin */}
          <Card className="h 1/2"> <p className="text-xs"> Procedencia</p>
            <div className="flex gap-1 justify-center">
              {originOptions.map((option) => (
                <div key={option.value} className="relative group">
                  <Button
                    variant={saleOrigin === option.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSaleOrigin(option.value as SaleOrigin)}
                    className="!p-1"
                  >
                    {option.icon}
                  </Button>
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Consumer Type */}
          <Card className="h 1/2"> <p className="text-xs">Tipo de consumidor </p>
            <div className="flex gap-1 justify-center">
              {consumerOptions.map((option) => (
                <div key={option.value} className="relative group">
                  <Button
                    variant={consumerType === option.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setConsumerType(option.value as ConsumerType)}
                    className="!p-1"
                  >
                    {option.icon}
                  </Button>
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>

            {drafts.length > 0 && (
              <Card className="p-2">
                <h4 className="text-xs font-semibold mb-1">Borradores guardados</h4>
                <div className="flex flex gap-2">
                  {drafts.map(draft => (
                    <div key={draft.id} className="flex justify-between items-center border px-2 py-1 rounded text-xs">
                      <button
                        onClick={() => handleLoadDraft(draft)}
                        className="text-left flex-1 hover:underline"
                      >
                        {draft.customer
                          ? `${draft.customer.name} ${draft.customer.lastName ?? ''}`
                          : 'Sin cliente'}
                      </button>
                      <button
                        onClick={() => {
                          deleteDraft(draft.id);
                          setDrafts(getDrafts()); // actualiza la lista
                        }}
                        className="text-red-500 hover:text-red-700 text-sm ml-2"
                        title="Eliminar borrador"
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

          </>
          )}   
          
          <div>  {/* Payment Methods */}
          <Card className="flex-1 p-1">
            <PaymentMethods
              total={total}
              onPaymentChange={setPayments}
              resetTrigger={resetKey}
            />

          </Card>
        </div>       
        </div>
        
        

        {/* Product Search */}
        <div className="w-1/3">
          <ProductSearch onAddToCart={handleAddToCart} />
        </div>

        {/* Products Table */}
        <div className="flex-1 overflow-auto min-h-[200px] max-h-[calc(100vh-400px)]">
          <Card className="h-full">
            <ProductTable
              items={cartItems}
              onUpdateItem={(item) => {
                const newItems = cartItems.map((i) => i.id === item.id ? item : i);
                setCartItems(newItems);
              }}
              onRemoveItem={(id) => {
                setCartItems(cartItems.filter((item) => item.id !== id));
              }}
            />
          </Card>
        </div>

        {/* Summary and Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-2">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (21%):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-primary-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Save size={16} />}
              onClick={handleSaveDraft}
            >
              Borrador
            </Button>

            
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw size={16} />}
              onClick={handleReset}
            >
              Nueva (N)
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Printer size={16} />}
              onClick={handlePrint}
            >
              Imprimir
            </Button>
              
              <div style={{ display: 'none' }}>
                <div ref={printRef} className="bg-white p-6">
                  <header className="grid grid-cols-3 items-start border-b pb-2">
                    <div>
                      <img src={logo} alt="Logo PlipShop" className="h-10 object-contain" />
                    </div>
                    <div className="text-center">
                      <h2 className="text-lg font-bold">PRESUPUESTO</h2>
                    </div>
                    <div className="text-right text-xs">
                      <p>
                        Nº{' '}
                        <strong>
                          {String(Math.floor(Math.random() * 10000)).padStart(4, '0')}
                        </strong>
                      </p>
                      <p>
                        Fecha:{' '}
                        <strong>{new Date().toLocaleDateString('es-AR')}</strong>
                      </p>
                    </div>
                    <div className="col-span-3 mt-2 text-xs text-gray-700">
                      <p><strong>Dirección:</strong> Av. Jujuy 50, C.A.B.A.</p>
                      <p><strong>Teléfono:</strong> 1127240042</p>
                      <p><strong>Correo:</strong> ventas.plipshop@gmail.com</p>
                      <p><strong>Web:</strong> www.plipshop.com.ar</p>
                    </div>
                  </header>

                  <section className="grid grid-cols-2 gap-4 mt-3 p-2 border rounded text-xs">
                    <div>
                      <p>
                        <strong>Cliente:</strong>{' '}
                        {customer ? `${customer.name} ${customer.lastName ?? ''}` : '—'}
                      </p>
                      <p><strong>Atendido por:</strong> {user?.nombre ?? '—'}</p>
                      <p>
                        <strong>Teléfono:</strong>{' '}
                        {customer?.phone ?? '—'}
                      </p>
                    </div>
                    <div className="text-right text-white">
                      
                      
                      <p>
                        <strong>Condición de IVA:</strong>{' '}
                        {taxType === 'sin_iva'
                          ? 'Sin IVA'
                          : taxType === '21'
                          ? 'IVA 21%'
                          : 'IVA 10.5%'}
                      </p>
                    
                    
                    
                    </div>
                  </section>

                  <table className="w-full mt-3 border-collapse text-xs">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-1 py-1 text-left">Item</th>
                        <th className="px-1 py-1 text-left">Código</th>
                        <th className="px-1 py-1 text-left">Artículo</th>
                        <th className="px-1 py-1 text-right">Cant.</th>
                        <th className="px-1 py-1 text-right">Precio</th>
                        <th className="px-1 py-1 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((p, i) => (
                        <tr
                          key={p.id}
                          className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td className="px-1 py-1">
                            {String(i + 1).padStart(4, '0')}
                          </td>
                          <td className="px-1 py-1">
                            {p.id.toString().padStart(5, '0')}
                          </td>
                          <td className="px-1 py-1">{p.name}</td>
                          <td className="px-1 py-1 text-right">{p.quantity}</td>
                          <td className="px-1 py-1 text-right">
                            {formatCurrency(p.price)}
                          </td>
                          <td className="px-1 py-1 text-right">
                            {formatCurrency(p.quantity * p.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="col-span-2" />
                    <div className="p-2 border rounded bg-gray-50 space-y-1">
                      <p>
                        Subtotal:{' '}
                        <strong>{formatCurrency(subtotal)}</strong>
                      </p>
                      <p>
                        IVA 10.5%:{' '}
                        <strong>
                          {taxType === '10.5'
                            ? formatCurrency(subtotal * 0.105)
                            : formatCurrency(0)}
                        </strong>
                      </p>
                      <p>
                        IVA 21%:{' '}
                        <strong>
                          {taxType === '21'
                            ? formatCurrency(subtotal * 0.21)
                            : formatCurrency(0)}
                        </strong>
                      </p>
                      <p className="text-sm mt-1">
                        TOTAL:{' '}
                        <strong className="text-blue-600">
                          {formatCurrency(total)}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <footer className="mt-4 border-t pt-2 text-xs text-gray-600">
                    <ul className="list-disc list-inside space-y-1">
                      <li>🟢 Todos los productos son de alta calidad garantizada.</li>
                      <li>
                        {' '}
                        {taxType === 'sin_iva' ? '' : ' 💡 Los precios son con IVA incluido'}.
                      </li>
                      <li>
                        🎁 Descuentos disponibles por compras mayores o clientes frecuentes.
                      </li>
                    </ul>
                  </footer>
                </div>
              </div>
            
            <Button
              size="sm"
              icon={<Save size={16} />}
              onClick={handleSaveSale}
            >
              Guardar (Enter)
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setEstadoVenta('presupuesto');
                setPayments([]); // forzamos sin pago
                handleSaveSale();
              }}
            >
              Presupuesto
            </Button>

            <Button
              variant="warning"
              size="sm"
              onClick={() => {
                setEstadoVenta('consigna');
                setPayments([]); // forzamos sin pago
                handleSaveSale();
              }}
            >
              Consigna
            </Button>

          </div>
        </div>
      </div>
    </Modal>
  );
};