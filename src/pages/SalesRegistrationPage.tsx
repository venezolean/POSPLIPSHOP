import React, { useState } from 'react';
import { ShoppingBag, Users, History, Package, Eye } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { NewSaleModal } from '../components/sales/NewSaleModal';
import { CustomersModal } from '../components/customers/CustomersModal';
import { SalesHistoryModal } from '../components/sales/SalesHistoryModal';
import { NewProductModal } from '../components/products/ProductsModal';
import { useNavigate } from 'react-router-dom';

export const SalesRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isCustomersModalOpen, setIsCustomersModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const gridItems = [
    { id: 'venta', icon: <ShoppingBag size={48} />, onClick: () => setIsSaleModalOpen(true) },
    { id: 'producto', icon: <Package size={48} />, onClick: () => setIsProductModalOpen(true) },
    { id: 'clientes', icon: <Users size={48} />, onClick: () => setIsCustomersModalOpen(true) },
    { id: 'historial', icon: <History size={48} />, onClick: () => setIsHistoryModalOpen(true) },
    { id: 'inventario', icon: <Eye size={48} />, onClick: () => navigate('/inventario') },
  ];

  return (
    <PageLayout title="Registro de Venta">
      <style>
        {`
          @keyframes wiggle {
            0%, 100% { transform: rotate(-2deg); }
            50% { transform: rotate(2deg); }
          }
          .hover\:animate-wiggle:hover {
            animation: wiggle 0.5s ease-in-out infinite;
          }
        `}
      </style>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
        {gridItems.map((item) => (
          <div
            key={item.id}
            onClick={item.onClick}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center justify-center cursor-pointer transition-transform hover:animate-wiggle"
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Modales */}
      <NewSaleModal isOpen={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} />
      <CustomersModal isOpen={isCustomersModalOpen} onClose={() => setIsCustomersModalOpen(false)} />
      <SalesHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} />
      <NewProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} />
    </PageLayout>
  );
};
