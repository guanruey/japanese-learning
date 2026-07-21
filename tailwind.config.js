/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
        },
        cream: {
          50: '#faf9f6',
          100: '#f5f3ef',
          200: '#e8e4dc',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
        jp: ['Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
