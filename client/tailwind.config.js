/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '2rem',
      },
      fontFamily: {
        mono: ['Courier New', ...defaultTheme.fontFamily.mono],
      },
      width: {
        128: '32rem',
      },
      boxShadow: {
        imageBox: 'inset 0 0 0 3px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
