import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for conditionally joining tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}