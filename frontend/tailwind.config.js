/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E53935',
          redHover: '#D32F2F',
          darkblue: '#1a237e',
          gold: '#D4AF37',
          goldText: '#B8860B',
          goldenbg: '#FFFDF0',
          goldenCard: '#FFF9E6',
          green: '#2E7D32',
          greenBg: '#E8F5E9',
          offblue: '#1565C0',
          offorange: '#E65100',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        'float': '0 10px 30px -5px rgba(229, 57, 53, 0.3)',
      },
    },
  },
  plugins: [],
}
