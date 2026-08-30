/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        earth: {
          50: '#fdf8f0',
          100: '#f5e9d3',
          500: '#a9772f',
          700: '#7a5220'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 2px 10px rgba(22, 101, 52, 0.08)',
        'card-hover': '0 8px 24px rgba(22, 101, 52, 0.16)'
      }
    }
  },
  plugins: []
};
