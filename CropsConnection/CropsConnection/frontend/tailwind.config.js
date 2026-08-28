/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        crop: {
          50: '#f2faf3',
          100: '#e0f3e3',
          200: '#bfe5c7',
          300: '#8fce9e',
          400: '#5bb072',
          500: '#3a9457',
          600: '#2a7645',
          700: '#235e39',
          800: '#1f4b30',
          900: '#1a3e29'
        },
        wheat: '#f8f6ef'
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        card: '0 2px 10px rgba(26, 62, 41, 0.08)'
      }
    }
  },
  plugins: []
};
