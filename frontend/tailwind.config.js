/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00E5C4',
          50: '#E6FFF9',
          100: '#CCFFF4',
          200: '#99FFEA',
          300: '#66FFE0',
          400: '#33FFD5',
          500: '#00E5C4',
          600: '#00B89D',
          700: '#008A76',
          800: '#005C4F',
          900: '#002E27',
        },
        secondary: {
          DEFAULT: '#7C4DFF',
          50: '#F5F0FF',
          100: '#EBE0FF',
          200: '#D6C2FF',
          300: '#C2A3FF',
          400: '#AD85FF',
          500: '#7C4DFF',
          600: '#6333FF',
          700: '#4A1AFF',
          800: '#3000E6',
          900: '#2400B3',
        },
        dark: {
          DEFAULT: '#121212',
          50: '#2D2D2D',
          100: '#252525',
          200: '#1E1E1E',
          300: '#171717',
          400: '#121212',
          500: '#0D0D0D',
          600: '#080808',
          700: '#030303',
          800: '#000000',
          900: '#000000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}