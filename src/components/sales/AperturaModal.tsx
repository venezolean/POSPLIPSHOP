// src/components/sales/AperturaModal.tsx
import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import { registrarAperturaCaja } from '../../utils/api'

interface AperturaModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmed: () => void
}

export const AperturaModal: React.FC<AperturaModalProps> = ({
  isOpen,
  onClose,
  onConfirmed,
}) => {
  const { user } = useAuth()
  const [amount, setAmount] = useState(0)

  const handleConfirm = async () => {
    if (!user || amount <= 0) return
    await registrarAperturaCaja({
      userId: String(user.id),
      monto: amount,
    })
    onConfirmed()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apertura de Caja">
      <div className="p-4 space-y-4">
        <label className="block text-sm font-medium">Monto de Apertura</label>
        <input
          type="number"
          min="0"
          value={amount}
          onChange={e => setAmount(parseFloat(e.target.value) || 0)}
          className="w-full p-2 border rounded"
        />
        <div className="text-right">
          <Button disabled={amount <= 0} onClick={handleConfirm}>
            Confirmar Apertura
          </Button>
        </div>
      </div>
    </Modal>
  )
}
        