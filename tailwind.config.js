/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  purge: ['./*.html', './src/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: '#080808',
        secondary: '#222222',
        tertiary: '#F7C1BB',
      },
    },
  },
  plugins: [],
};
