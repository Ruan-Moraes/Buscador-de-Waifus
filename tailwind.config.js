/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './src/**/*.js'],
  theme: {
    extend: {
      maxWidth: {
        '768px': '80rem',
      },
      colors: {
        waifupink: {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
        waifupurple: {
          900: '#4c1d95',
          950: '#2e1065',
        },
        glass: 'rgba(255, 255, 255, 0.05)',
        glassborder: 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
