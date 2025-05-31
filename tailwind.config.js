/** @type {import('tailwindcss').Config} */
import lineClamp from "@tailwindcss/line-clamp";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#133E87",
        secondary: "#608BC1",
        third: "#B3D7ED",
        fourth: "#F3F3E0",
      },
      textShadow: {
        sm: "1px 1px 2px rgba(0, 0, 0, 0.25)",
        DEFAULT: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        lg: "3px 3px 6px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [lineClamp],
};
