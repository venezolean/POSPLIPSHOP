// src/mocks/variant-options.ts

export interface VariantOption {
  key: string;
  label: string;
  type: 'multi-select' | 'text-array' | 'select' | 'number' | 'number-with-unit' | 'text';
  options?: (string | number)[];
}

export const variantOptions: VariantOption[] = [
  { key: 'color', label: 'Color', type: 'multi-select', options: ['Transparente', 'Negro', 'Rojo', 'Verde', 'Azul'] },
  { key: 'medida', label: 'Medida', type: 'text-array' },
  { key: 'micronaje', label: 'Micronaje', type: 'select', options: [20, 23, 25, 27, 30, 40, 45, 50, 60] },
  { key: 'diámetro', label: 'Diámetro', type: 'number' },
  { key: 'espesor', label: 'Espesor', type: 'number-with-unit' },
  { key: 'material', label: 'Material', type: 'text' },
  { key: 'adhesivo', label: 'Adhesivo', type: 'select', options: ['Acrílico', 'Hotmelt', 'Solvente'] },
  { key: 'formato', label: 'Formato', type: 'select', options: ['Rollo', 'Pliego', 'Bolsa'] },
  { key: 'presentación', label: 'Presentación', type: 'text' },
  { key: 'resistencia', label: 'Resistencia', type: 'number' },
  { key: 'capacidad', label: 'Capacidad', type: 'number-with-unit' },
  { key: 'uso_aplicacion', label: 'Uso / Aplicación', type: 'text' },
  { key: 'gramaje', label: 'Gramaje', type: 'text' }
];
