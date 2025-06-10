/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0f9',
          100: '#cce0f3',
          200: '#99c2e8',
          300: '#66a3dc',
          400: '#3385d1',
          500: '#0257a4', // Main primary color
          600: '#024683',
          700: '#013462',
          800: '#012342',
          900: '#001121',
        },
        accent: {
          50: '#e7f6fe',
          100: '#cfedfd',
          200: '#9fdcfa',
          300: '#92d4fa', // Main accent color
          400: '#5bbdf7',
          500: '#24a6f5',
          600: '#0c85c4',
          700: '#086493',
          800: '#054262',
          900: '#032131',
        },
        success: {
          50: '#e8f6e9',
          100: '#d2edd3',
          200: '#a5dba7',
          300: '#78c97b',
          400: '#4bb74f',
          500: '#2a9134', // Main success color
          600: '#22742a',
          700: '#195720',
          800: '#113a15',
          900: '#081d0b',
        },
        warning: {
          50: '#fff7e6',
          100: '#ffeece',
          200: '#ffdd9e',
          300: '#ffcc6d',
          400: '#ffbb3d',
          500: '#ffc220', // Main warning color
          600: '#cc9b1a',
          700: '#997413',
          800: '#664e0d',
          900: '#332706',
        },
        danger: {
          50: '#feece7',
          100: '#fcd9cf',
          200: '#f9b3a0',
          300: '#f68d70',
          400: '#f36741',
          500: '#fc340a', // Main danger color
          600: '#ca2a08',
          700: '#972006',
          800: '#651504',
          900: '#320a02',
        },
        secondary: {
          50: '#fff2e6',
          100: '#ffe6cc',
          200: '#ffcc99',
          300: '#ffb366',
          400: '#ff9933',
          500: '#ff6600', // Main secondary color
          600: '#cc5200',
          700: '#993d00',
          800: '#662900',
          900: '#331400',
        },
        'atomic-tangerine': '#ff914d', // Additional accent
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        modal: '0 4px 16px rgba(0, 0, 0, 0.12)',
        dropdown: '0 2px 5px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideUp: 'slideUp 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};