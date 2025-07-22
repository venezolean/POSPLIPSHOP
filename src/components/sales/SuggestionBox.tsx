import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { crearSugerencia } from '../../utils/api';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../context/AuthContext';

// Opciones de contexto para el Select
const contextOptions = [
  { value: 'sugerencia', label: 'Sugerencia' },
  { value: 'datos de cliente', label: 'Datos de cliente' },
  { value: 'compromisos', label: 'Compromisos' },
  { value: 'acuerdos', label: 'Acuerdos' },
];

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [context, setContext] = useState<string>('pantalla');
  const [nota, setNota] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    console.debug('handleSubmit called', { userId: user?.id, context, nota });
    if (!user) {
      console.warn('No user logged in');
      setMessage('Debes iniciar sesión para enviar sugerencias.');
      return;
    }
    if (!nota.trim()) {
      console.warn('Nota vacía');
      setMessage('La nota no puede estar vacía.');
      return;
    }
    setLoading(true);
    const contexto = { tipo: context };
    try {
      console.debug('Creating suggestion', { userId: String(user.id), contexto, nota });
      const result = await crearSugerencia({
        userId: String(user.id),
        contexto,
        nota: nota.trim(),
      });
      console.debug('crearSugerencia result:', result);
      if (result) {
        setMessage('Sugerencia enviada con éxito');
        setNota('');
      } else {
        console.error('crearSugerencia returned null');
        setMessage('Error al enviar la sugerencia');
      }
    } catch (error: any) {
      console.error('Error inesperado al crear sugerencia:', error);
      setMessage(`Error inesperado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enviar Sugerencia">
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <label htmlFor="context-select">Contexto</label>
          <Select
            id="context-select"
            name="contexto"
            value={context}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setContext(e.target.value)}
            options={contextOptions}
            fullWidth
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="nota-textarea">Nota</label>
          <textarea
            id="nota-textarea"
            value={nota}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNota(e.target.value)}
            rows={4}
            placeholder="Escribe tu sugerencia aquí..."
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {message && <p className="text-sm text-gray-600">{message}</p>}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
