/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Tailwind gray shades used
        gray: {
          100: "#f3f4f6", // light
          900: "#111827", // dark
        },
        // Token-based color aliases using CSS variables
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
