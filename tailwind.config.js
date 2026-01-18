/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable manual dark mode toggle
  theme: {
    extend: {
      colors: {
        't10-blue': {
          1: '#38769a', // Medium Blue
          2: '#aad5f1', // Light Blue/Cyan (Highlight)
          3: '#2d4b64', // Dark Blue (Dark BG)
          4: '#5f7c97', // Muted Blue/Grey (Border/Secondary)
          5: '#9cb4cb', // Light Grey-Blue (Text/Subtle)
        },
        't10-palette': {
          deepBlue: '#1E3A8A', // Header
          vibrantOrange: '#F97316', // Negative
          emeraldGreen: '#10B981', // Positive
          coralRed: '#EF4444', // Alerts
          amberYellow: '#F59E0B', // Warnings
          // Specific highlights
          costGradientStart: '#1E40AF',
          costGradientEnd: '#7C3AED',
          remainingBg: '#FEE2E2',
          remainingText: '#991B1B',
          stockBg: '#FEF3C7',
          stockText: '#92400E',
          totalCostBg: '#D1FAE5',
          totalCostText: '#065F46',
          methodSelected: '#2563EB',
          methodUnselected: '#9CA3AF'
        },
        't10-dark': {
          base: '#0F1419',
          surface: '#1E293B', // Slate escuro para cards
          surfaceBorder: '#334155',
          
          // Coluna Restante (Crítico)
          remainingBg: '#4C1D1D',
          remainingText: '#FCA5A5',
          remainingBorder: '#EF4444',
          
          // Coluna Estoque (Atenção)
          stockBg: '#3D3416',
          stockText: '#FDE68A',
          stockBorder: '#F59E0B',
          
          // Coluna Custo Total (Valor)
          totalCostBg: '#064E3B',
          totalCostText: '#6EE7B7',
          
          // Textos
          textPrimary: '#E0E7FF',
          textSecondary: '#CBD5E1',
          textHighlight: '#38BDF8', // Azul elétrico
          textHeader: '#F59E0B', // Laranja âmbar
        }
      }
    },
  },
  plugins: [],
}

