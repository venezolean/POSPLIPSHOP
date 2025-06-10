import React, { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  options: Option[];
  icon?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, icon, fullWidth = false, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'py-1.5 text-sm',
      md: 'py-2',
      lg: 'py-2.5 text-lg',
    };

    return (
      <div className={cn('flex flex-col', fullWidth ? 'w-full' : '')}>
        {label && (
          <label
            className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {icon}
            </div>
          )}

          <select
            ref={ref}
            className={cn(
              'appearance-none px-4 border border-gray-300 rounded-md shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'dark:bg-gray-800 dark:border-gray-700 dark:text-white',
              'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
              error ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : '',
              icon ? 'pl-10' : '',
              'pr-10',
              sizeClasses[size],
              fullWidth ? 'w-full' : '',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>

        {error && <p className="mt-1.5 text-sm text-danger-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';