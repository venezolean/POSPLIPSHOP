// src/mocks/variant-options.ts

export interface VariantOption {
  key: string;
  label: string;
  type: 'multi-select' | 'text-array' | 'select' | 'number' | 'number-with-unit' | 'text';
  options?: (string | number)[];
}

export const variantOptions: VariantOption[] = [
  {
    key: 'color',
    label: 'Color',
    type: 'multi-select',
    options: ['Transparente', 'Negro', 'Rojo', 'Verde', 'Azul']
  },
  {
    key: 'material',
    label: 'Material',
    type: 'text'
  },
  {
    key: 'micronaje_espesor',
    label: 'Micronaje o Espesor',
    type: 'select',
    options: [20, 23, 25, 27, 30, 40, 45, 50, 60]
  },
  {
    key: 'medida',
    label: 'Diámetro o Medida',
    type: 'text'
  },
  {
    key: 'formato_presentacion',
    label: 'Formato y Presentación',
    type: 'text'
  },
  {
    key: 'gramaje',
    label: 'Gramaje',
    type: 'number-with-unit'
  },
  {
    key: 'resistencia',
    label: 'Resistencia',
    type: 'text'
  },
  {
    key: 'uso_recomendado',
    label: 'Uso recomendado',
    type: 'text'
  }
];
