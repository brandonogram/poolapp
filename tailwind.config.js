/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
          800: '#002966',
          900: '#001433',
        },
        navy: {
          50: '#E6E9ED',
          100: '#CCD3DB',
          200: '#99A7B7',
          300: '#667B93',
          400: '#334F6F',
          500: '#001B44',
          600: '#001636',
          700: '#001129',
          800: '#000B1B',
          900: '#00060E',
        },
        cyan: {
          50: '#E6FBFF',
          100: '#CCF7FF',
          200: '#99EFFF',
          300: '#66E7FF',
          400: '#33DFFF',
          500: '#00D4FF',
          600: '#00AACC',
          700: '#007F99',
          800: '#005566',
          900: '#002A33',
        },
        // Dark mode surface colors
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          700: '#334155',
          800: '#1e293b',
          850: '#172033',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // Add animation for focus rings
      animation: {
        'focus-ring': 'focus-ring 0.3s ease-out',
      },
      keyframes: {
        'focus-ring': {
          '0%': { 'box-shadow': '0 0 0 0px rgba(0, 102, 255, 0.4)' },
          '100%': { 'box-shadow': '0 0 0 3px rgba(0, 102, 255, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
