import React, { useState } from 'react';
import { ShoppingBag, Users, History, Package, ChevronDown, Eye } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { NewSaleModal } from '../components/sales/NewSaleModal';
import { CustomersModal } from '../components/sales/CustomersModal';
import { SalesHistoryModal } from '../components/sales/SalesHistoryModal';
import { NewProductModal } from '../components/products/ProductsModal';
import { useNavigate } from 'react-router-dom';

export const SalesRegistrationPage: React.FC = () => {
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isCustomersModalOpen, setIsCustomersModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

  return (
    <PageLayout title="Registro de Venta">
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
        <div className="relative">
          <Button
            size="lg"
            className="w-64 h-16 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            icon={<ShoppingBag size={24} />}
          >
            Registrar
            <ChevronDown size={20} className="ml-2" />
          </Button>

          {isDropdownOpen && (
            <div className="absolute z-10 w-64 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <button
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsSaleModalOpen(true);
                }}
              >
                <ShoppingBag size={20} />
                <span>Nueva Venta</span>
              </button>
              <button
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 border-t border-gray-200 dark:border-gray-700"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsProductModalOpen(true);
                }}
              >
                <Package size={20} />
                <span>Nuevo Producto</span>
              </button>
            </div>
          )}
        </div>

        <Button
          size="lg"
          variant="secondary"
          className="w-64 h-16 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
          onClick={() => setIsCustomersModalOpen(true)}
          icon={<Users size={24} />}
        >
          Clientes
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="w-64 h-16 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
          onClick={() => setIsHistoryModalOpen(true)}
          icon={<History size={24} />}
        >
          Historial de Ventas
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="w-64 h-16 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
          onClick={() => navigate('/inventario')}
          icon={<Eye size={24} />}
        >
          Ver Inventario
        </Button>
      </div>

      <NewSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
      />

      <CustomersModal
        isOpen={isCustomersModalOpen}
        onClose={() => setIsCustomersModalOpen(false)}
      />

      <SalesHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />

      <NewProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
    </PageLayout>
  );
};