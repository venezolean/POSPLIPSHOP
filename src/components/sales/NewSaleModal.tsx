import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { ProductSearch } from './ProductSearch';
import { ProductTable } from './ProductTable';
import { PaymentMethods } from './PaymentMethods';
import { CustomerSearch } from '../customers/CustomerSearch';
import { Card } from '../ui/Card';
import { Save, Printer, RefreshCw, ShoppingBag, Globe, Smartphone, ShoppingCart, User, Users, Package, Briefcase } from 'lucide-react';
import { Button } from '../ui/Button';
import { CartItem, Customer, SaleDraft, PaymentDetail, SaleOrigin, ConsumerType, VentaRPC, CierreCaja } from '../../utils/types';
import { calculateSubtotal, calculateTax, calculateTotal, formatCurrency } from '../../utils/calculations';
import { useAuth } from '../../context/AuthContext';
import { actualizarPresupuestoVenta, registrarVenta, getCierreCaja, registrarCierreCaja } from '../../utils/api';
import { saveDraft, deleteDraft, getDrafts } from '../../utils/draft';
import { v4 as uuidv4 } from 'uuid';
import { useReactToPrint } from 'react-to-print'
import logo from './img/Plip.png';
import '../../index.css'
import { PresupuestoSearch } from './PresupuestoSearch';
import { mapVentaRPC } from '../../utils/mappers';
import { SuggestionModal } from './SuggestionBox';


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
  const [showCierre, setShowCierre] = useState(false);
  const [cierreData, setCierreData] = useState<CierreCaja | null>(null);
  const [closeAmount, setCloseAmount] = useState<number>(0);
  const [isSugModalOpen, setIsSugModalOpen] = useState(false);
  


  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [mostrar, setMostrar] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const [selectedPresupuestoId, setSelectedPresupuestoId] = useState<number | null>(null);


  useEffect(() => {
    const newSubtotal = calculateSubtotal(cartItems);
    let rate = 0;
    if (taxType === '10.5') rate = 0.105;
    else if (taxType === '21')  rate = 0.21;

    const newTax   = calculateTax(newSubtotal, rate);
    const newTotal = calculateTotal(newSubtotal, discount, newTax);
    
    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  }, [cartItems, discount, taxType]);

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

  let dbTaxType: 'con_iva' | 'medio_iva' | 'sin_iva';

    if (taxType === 'sin_iva') {
      dbTaxType = 'sin_iva';
    } else if (taxType === '10.5') {
      dbTaxType = 'medio_iva';
    } else {
      // taxType === '21'
      dbTaxType = 'con_iva';
    }

if (selectedPresupuestoId) {

  if (!selectedPresupuestoId ||  !payments.length) {
    alert('Debés agregar al menos un método y monto de pago antes de convertir el presupuesto.');
    return;
  }
  
    try {
      await actualizarPresupuestoVenta(selectedPresupuestoId, payments);
      alert(`Presupuesto #${selectedPresupuestoId} convertido en venta`);
      handleReset();
    } catch (e: any) {
      console.error(e);
      alert(`Error al actualizar presupuesto: ${e.message}`);
    }
    return;
  }
  
  const ventaParams = {
    p_cliente_id: customer ? Number(customer.id) : 1,
    p_origen: saleOrigin,
    p_tipo_consumidor: consumerType,
    p_tipo_iva: dbTaxType,
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

 // Cerrar caja
  // 1) Vista previa de cierre (no persiste)
  const previewCierre = async () => {
      // 1) Pedimos el código
  const codigo = window.prompt('Ingrese el código de autorización:')?.trim();
  if (codigo !== '0411') {
    alert('Código PUTO');
    return;
  }

    if (!user) return;
    try {
      const cierre = await getCierreCaja(String(user.id));
      setCierreData(cierre);
      setCloseAmount(cierre.monto_apertura);
      setShowCierre(true);
    } catch (e: any) {
      console.error(e);
      alert(`Error al obtener datos de cierre: ${e.message}`);
    }
  };

  // 2) Confirmar y persistir el cierre
  const confirmCierre = async () => {
  if (!user) return;
  try {
    await registrarCierreCaja({
      userId: String(user.id),
      amount: closeAmount,    // <--- le pasás el monto que tipeaste
    });
    setShowCierre(false);
    alert('Cierre registrado correctamente: ' + formatCurrency(closeAmount));
    handleReset ();
    onClose();
  } catch (e: any) {
    console.error(e);
    alert(`Error al registrar cierre: ${e.message}`);
  }
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
  setMostrar(false);
  setEstadoVenta('entregado')
};

// 1. al principio del componente:
const loadPresupuesto = (v: VentaRPC) => {
  setSelectedPresupuestoId(v.id);
  // Si ya tenés mapVentaRPC, la podés usar:
  const {
    items,
    payments,
    customer,
    origen,
    consumerType,
    estado,
    tipo_iva
  } = mapVentaRPC(v);

  setCartItems(items);
  setPayments(payments);
  setCustomer(customer);
  setSaleOrigin(origen);
  setConsumerType(consumerType);
  setEstadoVenta(estado);
  setTaxType(
    tipo_iva === 'medio_iva' ? '10.5' :
    tipo_iva === 'con_iva'   ? '21'   :
    'sin_iva'
  );
};

const handleSetMLZeroPrice = () => {
  const updatedItems = cartItems.map((item) => ({
    ...item,
    price: 0,
    subtotal: 0,
  }));
  setCartItems(updatedItems);
  setSaleOrigin('Mercado_libre');
};

const handleMLVenta = async () => {
  handleSetMLZeroPrice();
  await new Promise((r) => setTimeout(r, 0)); // deja que React actualice
  handleSaveSale();
};

const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Presupuesto PlipShop',
      pageStyle: `
    @page { margin: 20mm; }
    @media print {
      body * { visibility: hidden !important; }
      .print-container, .print-container * { visibility: visible !important; }
      .print-container { position: absolute; top: 0; left: 0; width: 100%; }
    }
  `,
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
    setEstadoVenta('entregado')
    setSelectedPresupuestoId(null);
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
      className="no-print"
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
  type="button"
  onClick={() => {
    const types = ['sin_iva', '10.5', '21'];
    const next = types[(types.indexOf(taxType) + 1) % types.length];
    setTaxType(next);
  }}
  className={`px-4 py-2 rounded ${
    taxType === 'sin_iva'
      ? 'bg-black text-white'
      : taxType === '10.5'
      ? 'bg-gray-500 text-white'
      : 'bg-white text-black border border-gray-500'
  }`}
>
  {taxType === 'sin_iva'
    ? '🫵'
    : taxType === '10.5'
    ? '🕵️'
    : '👌'}
</Button>
  
        <Button
          onClick={() => setMostrar(!mostrar)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {mostrar ? "Ocultar" : "Mostrar"}
        </Button>
          {mostrar && (
          
          <>
          {/* Sale Origin */}
          <Card className="h 1/2"> <h4 className="text-xs font-semibold mb-1">Procedencias</h4>
            <div className="flex gap-1 justify-center">
              {originOptions.map((option) => (
                <div key={option.value} className="relative group overflow-visible">
                  <Button
                    variant={saleOrigin === option.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSaleOrigin(option.value as SaleOrigin)}
                    className="!p-1"
                  >
                    {option.icon}
                  </Button>
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded invisible group-hover:visible  transition-opacity whitespace-nowrap">
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Consumer Type */}
          <Card className="h 1/2"> <h4 className="text-xs font-semibold mb-1">Tipo de consumidor</h4>
            <div className="flex gap-1 justify-center">
              {consumerOptions.map((option) => (
                <div key={option.value} className="relative group overflow-visible">
                  <Button
                    variant={consumerType === option.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setConsumerType(option.value as ConsumerType)}
                    className="!p-1"
                  >
                    {option.icon}
                  </Button>
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded invisible group-hover:visible  transition-opacity whitespace-nowrap">
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
                          ? `${draft.customer.name}`
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
          
          {/* presupuesto Search */}
        <div className="flex-1/2 w-1/3 justify-start">
          <PresupuestoSearch onSelect={loadPresupuesto} />
        </div>
        </div>
        

        {/* Product Search */}
        <div className="w-1/3">
          <ProductSearch onAddToCart={handleAddToCart} />
           <>
            <Button onClick={() => setIsSugModalOpen(true)}>Dejar Sugerencia</Button>
              <SuggestionModal 
                isOpen={isSugModalOpen} 
                onClose={() => setIsSugModalOpen(false)} 
              />
            </>
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
              {/* Subtotal */}
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {/* IVA dinámico */}
              {taxType !== 'sin_iva' && (
                <div className="flex justify-between">
                  <span>
                    {taxType === '10.5'
                      ? 'IVA (10.5%):'
                      : 'IVA (21%):'}
                  </span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-primary-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </Card>
          <Card overflow-x-auto>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Save size={16} />}
                onClick={handleSaveDraft}
                className="gap-0 sm:gap-2"
              >
                <span className="hidden sm:inline">Borrador</span>
              </Button>

              
              <Button
                variant="outline"
                size="sm"
                icon={<RefreshCw size={16} />}
                onClick={handleReset}className="gap-0 sm:gap-2"
              >
                <span className="hidden sm:inline">Nueva (N)</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={<Printer size={16} />}
                onClick={handlePrint}
                className="gap-0 sm:gap-2"
              >
                <span className="hidden sm:inline">Imprimir</span>
              </Button>
                                    
              <Button
                size="sm"
                icon={<Save size={16} />}
                onClick={handleSaveSale}
                className="gap-0 sm:gap-2"
              >
                <span className="hidden sm:inline">Guardar (Enter)</span>
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setEstadoVenta('presupuesto');
                  setPayments([]); // forzamos sin pago
                  handleSaveSale();
                }}
                className="gap-0 sm:gap-2"
              >
                <span className="hidden sm:inline">Presupuesto</span>
              </Button>

              <Button
                variant="warning"
                size="sm"
                onClick={() => {
                  setEstadoVenta('consigna');
                  setPayments([]); // forzamos sin pago
                  handleSaveSale();
                }}
                className="gap-0 sm:gap-2"
              >
                <span className="hidden sm:inline">Consigna</span>
              </Button>

          <Button onClick={previewCierre} variant="outline">Cerrar Caja</Button>
 

              <Button
                variant="warning"
                size="sm"
                onClick={handleMLVenta}
                className="gap-0 sm:gap-2"
              >
                ML Precio $0 + Guardar
              </Button>

            </div>
          </Card>
          
        </div>
      </div>
              <div>
                <div ref={printRef} className="print-container bg-white p-6">
                  <header className="grid grid-cols-3 items-start border-b pb-2">
                    <div>
                      <img src={logo} alt="Logo PlipShop" className="h-500 object-contain" />
                    </div>
                    <div className="text-center">
                      <h1 className="text-s font-bold">PRESUPUESTO</h1>
                      <p className="text-xs">(No valido como factura)</p>
                    </div>
                    <div className="text-right text-xs">
                      <p>
                        Nº{' '}
                        <strong>
                          {String(Math.floor(Math.random() * 1000000)).padStart(4, '0')}
                        </strong>
                      </p>
                      <p>
                        Fecha:{' '}
                        <strong>{new Date().toLocaleDateString('es-AR')}</strong>
                      </p>
                    </div>
                    <div className="col-span-3 mt-2 text-xs text-gray-700">
                      <p><strong>Dirección:</strong> Av. Jujuy 50, C.A.B.A.</p>
                      <p><strong>Teléfono:</strong> 1128783367</p>
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
                      <p><strong>Direccion:</strong> {customer?.address ?? '—'}</p>
                      <p>
                        <strong>Teléfono:</strong>{' '}
                        {customer?.phone ?? '—'}
                      </p>
                    </div>
                    <div className="text-right ">
                      
                      
                      <p>
                        <strong>Atendido por:</strong> {user?.nombre ?? '—'}{' '}
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
                        {/* Subtotal */}
                        <p>
                          Subtotal:{' '}
                          <strong>{formatCurrency(subtotal)}</strong>
                        </p>

                        {/* IVA dinámico */}
                        {taxType === '10.5' && (
                          <p>
                            IVA 10.5%:{' '}
                            <strong>{formatCurrency(subtotal * 0.105)}</strong>
                          </p>
                        )}
                        {taxType === '21' && (
                          <p>
                            IVA 21%:{' '}
                            <strong>{formatCurrency(subtotal * 0.21)}</strong>
                          </p>
                        )}

                        {/* Total */}
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
                      <li>🟢 Presupuesto valido por 24 horas.</li>
                      
                        
                        {taxType === 'sin_iva' ? <li>📲Compras Mayoristas al 11 6917-4577</li> : <li> 💡 Los precios son con IVA incluido.</li>}
                      
                      <li>
                        🎁 Descuentos disponibles por compras mayores o clientes frecuentes.
                      </li>
                    </ul>
                  </footer>
                </div>
              </div>
    
    
    
    
    
    
    
    
    
    
    
    
    
    {/* Modal de Cierre */}
    {showCierre && cierreData && (
      <Modal
        isOpen={showCierre}
        onClose={() => {
          setShowCierre(false);
          setCierreData(null);
          setCloseAmount(0);
        }}
        title="Cierre de Caja"
      >
        {(() => {
          const {
            inicio,
            fin,
            monto_apertura,
            ventas_origen ={},
            pagos_metodo = {}
          } = cierreData

          // total de ventas
          const totalVentas = Object.values(ventas_origen)
            .reduce((acc, obj) => acc + ((obj && obj.monto) ?? 0), 0)

          // montos por método de pago
          const efe = pagos_metodo.efectivo?.monto ?? 0

          return (
            <div className="p-4 space-y-2 text-sm">
              <p>
                <strong>Inicio:</strong>{' '}
                {new Date(inicio).toLocaleString()}
              </p>
              <p>
                <strong>Fin:</strong>{' '}
                {new Date(fin).toLocaleString()}
              </p>
              <p>
                <strong>Apertura:</strong>{' '}
                {formatCurrency(monto_apertura)}
              </p>
              <p>
                <strong>Total Ventas:</strong>{' '}
                {formatCurrency(totalVentas)}
              </p>
              <p>
                <strong>Efectivo:</strong>{' '}
                {formatCurrency(efe)}
              </p>
              <p>
                <strong>Caja Final:</strong>{' '}
                {formatCurrency(monto_apertura + efe)}
              </p>
            </div>
          )
        })()}
        <div>
          <label className="block text-sm font-medium">Monto de Cierre</label>
          <input
            type="number"
            className="mt-1 block w-full p-2 border rounded"
            value={closeAmount}
            onChange={e => setCloseAmount(parseFloat(e.target.value) || 0)}
            min="0"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={confirmCierre}>Confirmar Cierre</Button>
          <Button variant="outline" onClick={() => setShowCierre(false)}>
            Cancelar
          </Button>
        </div>
      </Modal>
    )}

    </Modal>
    
  );
};