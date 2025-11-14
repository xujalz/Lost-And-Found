/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enable dark mode using "dark" class
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0f172a",
        darkCard: "#1e293b",
      },
      boxShadow: {
        glass: "0px 4px 30px rgba(0,0,0,0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
