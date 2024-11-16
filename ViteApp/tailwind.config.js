/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],

  content: [
    "../foodigo/**/*.html",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx,html}",
    "./src/**/*.{js,jsx,html}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        figtree: ["Figtree"],
      },
      colors: {
        peach: "#FBE0DC",
        dark: "#1B1B1B",
        "gray-text": "#ABABAA",
        sandia: "#ff7470",
        olive: "#5d6544",
      },
      backgroundImage: {
        chef: "url('/src/assets/chef.png')",
        chef2: "url('/src/assets/mobilechef.jpg')",
      },
      // background: {
      //   'dark': "#1B1B1B"
      // },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
