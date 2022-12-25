module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#1976d3",
        "blue-800": "#2d4280",
        whitesmoke: "#f8f8f8",
        teal: "#00519d",
        dodgerblue: "#009df9",
        coral: "#f79646",
        seagreen: "#46c35f",
      },
    },
  },
  variants: {
    extend: {
      // #1E3A8A
    },
  },
  plugins: [],
};
