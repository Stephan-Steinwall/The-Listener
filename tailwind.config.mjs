/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        // Warm light palette
        cream: "#fcfaf8",
        blush: "#f5e6e0",
        "blush-dark": "#e8cfc7",
        taupe: "#6b5c55",
        // Warm dark palette
        charcoal: "#1a1817",
        "charcoal-mid": "#242120",
        "charcoal-light": "#2e2b29",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
