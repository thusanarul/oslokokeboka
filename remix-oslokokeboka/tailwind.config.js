/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      white: "#ffffff",
      paper: "#E9DFD6",
      ochre: "#FFC047",
      salmon: "#FF7880",
      red: "#D04C4C",
      pink: "#FF7BE2",
      green: "#40993E",
      blue: "#2D5EBE",
      purple: "#39124B",
      darkwine: "#26061D",
      darkestwine: "#10000B",
    },
    extend: {
      fontFamily: {},
      backgroundImage: {
        chevron: "url('/images/svg/chevron.svg')",
        check: "url('/images/svg/check.svg')",
        rectangle: "url('/images/svg/rectangle.svg')",
        plus: "url('/images/svg/plus.svg')",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
