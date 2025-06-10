import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Mail, Lock, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError('Correo o contraseña incorrectos.');
    } else {
      navigate('/recepcion');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 text-white rounded-full mb-4 animate-pulse">
            <ShoppingCart size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">POS System</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Inicie sesión para acceder al sistema
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-danger-50 text-danger-700 rounded-md flex items-start dark:bg-danger-900/30 dark:text-danger-400">
                <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              fullWidth
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={18} />}
              fullWidth
            />

            <Button type="submit" fullWidth isLoading={loading}>
              Iniciar sesión
            </Button>
          </form>
        </Card>

        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
          © {new Date().getFullYear()} POS System. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};