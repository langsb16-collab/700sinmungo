/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1428A0",
        primaryLight: "#3B5BDB",
        primaryDark: "#0B1E6D",
        accent: "#FF7A00",
        success: "#00C853",
        danger: "#FF3B30",
        info: "#00B0FF",
        bgMain: "#F5F7FB",
        cardBg: "rgba(255, 255, 255, 0.75)",
        glassBg: "rgba(255, 255, 255, 0.6)",
        textMain: "#0F172A",
        textSub: "#64748B",
        textLight: "#94A3B8",
      },
      fontFamily: {
        sans: ["Samsung Sans", "Pretendard", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.1)",
      },
      backdropBlur: {
        xs: "4px",
      },
    },
  },
  plugins: [],
}
