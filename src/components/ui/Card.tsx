import React from 'react';
import { cn } from '../../lib/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  bordered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  subtitle,
  footer,
  bordered = true,
  padding = 'sm', // Reducido a 'sm' por defecto
}) => {
  const paddingMap = {
    none: 'p-0',
    sm: 'p-2', // Más compacto que antes
    md: 'p-3',
    lg: 'p-4',
  };

  return (
    <div
      className={cn(
        'rounded-md bg-white dark:bg-gray-800 shadow-sm', // Reducción en tamaño y sombra
        bordered ? 'border border-gray-200 dark:border-gray-700' : '',
        className
      )}
    >
      {(title || subtitle) && (
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          {title && <h3 className="text-sm font-medium text-gray-800 dark:text-white">{title}</h3>}
          {subtitle && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      )}

      <div className={paddingMap[padding]}>{children}</div>

      {footer && (
        <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-md text-sm">
          {footer}
        </div>
      )}
    </div>
  );
};