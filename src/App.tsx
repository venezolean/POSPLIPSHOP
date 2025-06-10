import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoginPage } from './pages/LoginPage';
import { SalesRegistrationPage } from './pages/SalesRegistrationPage';
import { InventoryPage } from './Inventory/InventoryPage';
import { useAuth } from './context/AuthContext';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/recepcion" 
        element={
          <ProtectedRoute>
            <SalesRegistrationPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/inventario" 
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/recepcion\" replace />} />
      <Route path="*" element={<Navigate to="/recepcion\" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;