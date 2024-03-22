/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  purge: ["./*.html", "./src/**/*.js"],
  theme: {
    extend: {
      fontSize: {
        "3xs": "0.5rem",
      },

      spacing: {
        3.5: "0.875rem",
      },
      borderWidth: {
        1: "1px",
      },
      colors: {
        "!050609": "#050609",
        "!F855B1": "#F855B1",
        "!FFC6AC": "#FFC6AC",
        "!242424": "#242424",
      },
    },
  },
  plugins: [],
};
