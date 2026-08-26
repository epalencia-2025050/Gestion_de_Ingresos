/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // Exact Colors provided by user:
        // A2: Fondo DashBoard #124b60
        dashboardBg: '#124b60',
        // A3: Naranja Botón / Buscador #f2a625
        naranja: {
          DEFAULT: '#f2a625',
          hover: '#e0951b',
          light: '#f5b54c',
        },
        // A1: Gradiente #1a8881 a #285e6d
        cardTeal: {
          start: '#1a8881',
          end: '#285e6d',
        },
        texto: {
          primary: '#ffffff',
          muted: '#95b5bc',
          dimmed: '#76949b',
        },
        // Compatibilidad
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#1a8881',
          600: '#285e6d',
          700: '#124b60',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'card-gradient': 'linear-gradient(90deg, #1a8881 0%, #285e6d 100%)',
        'pill-gradient': 'linear-gradient(90deg, #1a8881 0%, #285e6d 100%)',
      },
    },
  },
  plugins: [],
};
