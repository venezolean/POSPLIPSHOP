import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../ui/Table';
import { Search, Calendar, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/calculations';
import { mockSales } from '../../mocks/mockData';

interface SalesHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SalesHistoryModal: React.FC<SalesHistoryModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Historial de Ventas"
      size="xl"
    >
      <div className="space-y-6">
        <div className="flex gap-4">
          <Input
            placeholder="Buscar por cliente o número de venta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            fullWidth
          />
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            icon={<Calendar size={18} />}
          />
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            icon={<Calendar size={18} />}
          />
        </div>

        <Table striped hoverable>
          <TableHead>
            <TableRow>
              <TableCell header>Fecha</TableCell>
              <TableCell header>Cliente</TableCell>
              <TableCell header align="center">Items</TableCell>
              <TableCell header align="right">Total</TableCell>
              <TableCell header align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.date}</TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell align="center">{sale.items}</TableCell>
                <TableCell align="right">{formatCurrency(sale.total)}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Eye size={16} />}
                    onClick={() => alert(`Ver detalles de venta ${sale.id}`)}
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Modal>
  );
};