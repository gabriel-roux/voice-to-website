/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Modo escuro com base na classe
  theme: {
    extend: {
      backgroundColor: {
        'blue-light': '#1A202C',
        'blue-dark': '#0D121B',
      },
      textColor: {
        'blue-light': '#1A202C',
        'blue-dark': '#0D121B',
      },
    },
  },
  plugins: [],
}
