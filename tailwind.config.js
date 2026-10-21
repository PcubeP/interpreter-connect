/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blossom: '#f7b7d2',
        lavender: '#c8b6ff',
        sky: '#a7d8f0',
        mint: '#b8e6cf',
        butter: '#ffe6a7',
        peach: '#ffd4bd',
        ink: '#4a4458',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(120, 100, 160, 0.35)',
      },
    },
  },
  plugins: [],
}
