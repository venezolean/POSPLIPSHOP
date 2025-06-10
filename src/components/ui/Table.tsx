import React from 'react';
import { cn } from '../../lib/cn';

interface TableProps {
  children: React.ReactNode;
  className?: string;
  condensed?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
}

export const Table: React.FC<TableProps> = ({
  children,
  className,
  condensed = false,
  striped = false,
  hoverable = true,
  bordered = true,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn(
          'w-full table-auto',
          bordered ? 'border border-gray-200 dark:border-gray-700' : '',
          className
        )}
      >
        {children}
      </table>
    </div>
  );
};

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHead: React.FC<TableHeadProps> = ({ children, className }) => (
  <thead className={cn('bg-gray-50 dark:bg-gray-800', className)}>
    {children}
  </thead>
);

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
}

export const TableBody: React.FC<TableBodyProps> = ({
  children,
  className,
  striped = false,
  hoverable = true,
}) => (
  <tbody
    className={cn(
      className,
      striped ? '[&>tr:nth-child(odd)]:bg-gray-50 [&>tr:nth-child(odd)]:dark:bg-gray-800/50' : '',
      hoverable ? '[&>tr:hover]:bg-gray-100 [&>tr:hover]:dark:bg-gray-700/30' : ''
    )}
  >
    {children}
  </tbody>
);

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className, selected = false }) => (
  <tr
    className={cn(
      'border-b border-gray-200 dark:border-gray-700',
      selected ? 'bg-primary-50 dark:bg-primary-900/20' : '',
      className
    )}
  >
    {children}
  </tr>
);

interface TableCellProps {
  children?: React.ReactNode;
  className?: string;
  header?: boolean;
  align?: 'left' | 'center' | 'right';
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className,
  header = false,
  align = 'left',
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const Tag = header ? 'th' : 'td';

  return (
    <Tag
      className={cn(
        'px-4 py-3',
        header ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-700 dark:text-gray-300',
        alignClasses[align],
        className
      )}
    >
      {children}
    </Tag>
  );
};