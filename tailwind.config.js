/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  purge: ['./*.html', './src/**/*.js'],
  theme: {
    extend: {
      maxWidth: {
        '768px': '80rem',
      },
      colors: {
        primary: '#080808',
        secondary: '#222222',
        tertiary: '#F7C1BB',
      },
    },
  },
  plugins: [],
};
