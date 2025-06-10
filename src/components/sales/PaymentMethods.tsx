import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PaymentDetail, PaymentMethod } from '../../utils/types';
import { formatCurrency } from '../../utils/calculations';

interface PaymentMethodsProps {
  total: number;
  onPaymentChange: (payments: PaymentDetail[]) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ total, onPaymentChange }) => {
  const [selectedMethods, setSelectedMethods] = useState<PaymentMethod[]>([]);
  const [payments, setPayments] = useState<Record<PaymentMethod, number>>({
  efectivo: 0,
  tarjeta: 0,
  transferencia: 0,
});
const [isChange, setIsChange] = useState(false);

const paymentIcons = {
  efectivo: <DollarSign size={18} />,
  tarjeta: <CreditCard size={18} />,
  transferencia: <Send size={18} />,
};

const paymentLabels = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia',
};


  useEffect(() => {
    const paymentDetails = selectedMethods.map((method) => ({
      method,
      amount: payments[method],
    }));
    onPaymentChange(paymentDetails);
  }, [payments, selectedMethods]);

  const togglePaymentMethod = (method: PaymentMethod) => {
    if (selectedMethods.includes(method)) {
      const newSelectedMethods = selectedMethods.filter((m) => m !== method);
      setSelectedMethods(newSelectedMethods);
      setPayments((prev) => ({ ...prev, [method]: 0 }));
    } else {
      setSelectedMethods([...selectedMethods, method]);
      if (selectedMethods.length === 0) {
        setPayments((prev) => ({ ...prev, [method]: total }));
      }
    }
  };

const handleAmountChange = (method: PaymentMethod, amount: number) => {
  const newPayments = { ...payments, [method]: amount };
  setPayments(newPayments);
};


  const totalPaid = Object.values(payments).reduce((sum, amount) => sum + amount, 0);
  const remaining = total - totalPaid;
  const change = totalPaid > total ? totalPaid - total : 0;

  useEffect(() => {
  setIsChange(totalPaid > total);
}, [totalPaid, total]);


  return (
    <div className="space-y-2">
      <div className="flex gap-1 justify-center">
        {(Object.keys(paymentIcons) as PaymentMethod[]).map((method) => (
          <div key={method} className="relative group">
            <Button
              variant={selectedMethods.includes(method) ? 'primary' : 'outline'}
              size="sm"
              onClick={() => togglePaymentMethod(method)}
              className="!p-1"
            >
              {paymentIcons[method]}
            </Button>
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {paymentLabels[method]}
            </span>
          </div>
        ))}
      </div>

      {selectedMethods.length > 1 && (
        <div className="absolute z-10 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 w-64">
          {selectedMethods.map((method) => (
            <div key={method} className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                {paymentIcons[method]}
                <span className="text-sm">{paymentLabels[method]}</span>
              </div>
              <Input
                type="number"
                min={0}
                value={payments[method]}
                onChange={(e) => handleAmountChange(method, parseFloat(e.target.value))}
                className="text-sm"
                fullWidth
              />
            </div>
          ))}
          
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-sm">
              <span>Total a pagar:</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total pagado:</span>
              <span className={totalPaid === total ? 'text-success-500' : 'text-warning-500'}>
                {formatCurrency(totalPaid)}
              </span>
            </div>
                {!isChange && remaining > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Restante:</span>
                    <span className="text-danger-500">{formatCurrency(remaining)}</span>
                  </div>
                )}

                {isChange && (
                  <div className="flex justify-between text-sm">
                    <span>Vuelto:</span>
                    <span className="text-success-500">{formatCurrency(change)}</span>
                  </div>
                )}

          </div>
        </div>
      )}
    </div>
  );
};