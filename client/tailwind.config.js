/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode:'class',
  theme: {
    extend: {
      colors: {
        primary: "hsl(221, 83%, 53%)",
        success: "hsl(142, 71%, 45%)",
        background: "hsl(0,0%,98%)",
        surface: "hsl(0,0%,100%)",
        "text-primary": "hsl(222,47%,11%)",
        "text-secondary": "hsl(215,16%,47%)"
      },
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"]
      },
      borderRadius: { "2xl": "1rem" }
    },
  },
  plugins: [],
};
