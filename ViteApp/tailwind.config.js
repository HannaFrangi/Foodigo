/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "../foodigo/**/*.html",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx,html}",
    "./src/**/*.{js,jsx,html}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
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
        figtree: ["Figtree", "sans-serif"], // Ensure fallback font for compatibility
      },
      colors: {
        peach: "#FBE0DC",
        dark: "#1B1B1B",
        "gray-text": "#ABABAA",
        sandia: "#ff7470",
        olive: "#5d6544",
        lowolive: "5d65444d",
        // Dark mode shades
        darkBackground: "#121212", // Background for dark mode
        darkText: "#EAEAEA", // Text color for dark mode
        darkAccent: "#BB86FC", // Accent color for dark mode (light purple)
        lightBackground: "#FFFFFF", // Background for light mode
        lightText: "#121212", // Text color for light mode
      },
      backgroundImage: {
        chef: "url('/src/assets/chef.png')",
        chef2: "url('/src/assets/mobilechef.jpg')",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shine: {
          "0%": { "background-position": "-200% 0" },
          "100%": { "background-position": "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shine: "shine 1.5s ease-in-out",
      },
    },
  },
  darkMode: "class",
  plugins: [require("tailwindcss-animate"), nextui()],
};
