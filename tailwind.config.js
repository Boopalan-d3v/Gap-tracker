/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#f1f5f9",
        panel: "#ffffff",
        line: "#e2e8f0",
        teal: "#0d9488",
        blue: "#2563eb",
        rose: "#e11d48",
        gold: "#d97706",
        mint: "#059669",
        violet: "#7c3aed",
      },
      boxShadow: {
        panel: "0 4px 20px rgba(0,0,0,0.07)",
        drawer: "0 0 40px rgba(0,0,0,0.15)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(37,99,235,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.07) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
