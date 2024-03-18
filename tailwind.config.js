/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        "!050609": "#050609",
        "!F855B1": "#F855B1",
        "!FFC6AC": "#FFC6AC",
        "!242424": "#242424",
      },
      spacing: {
        3.5: "0.875rem",
      },
      borderWidth: {
        1: "1px",
      },
    },
  },
  plugins: [],
};
