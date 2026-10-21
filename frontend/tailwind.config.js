
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f6ff',
          100: '#e0edff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        navy: {
          950: '#090d16',
          900: '#0d1322',
          850: '#11192e',
          800: '#16203b',
          700: '#1f2e54',
        },
      },
    },
  },
  plugins: [],
}
