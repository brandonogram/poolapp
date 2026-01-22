/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
      },
      fontFamily: {
        sans: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
