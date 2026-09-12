import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fdf5f3",
          100: "#fbe8e4",
          200: "#f6cfc7",
          300: "#efad9e",
          400: "#e38569",
          500: "#d4603d",
          600: "#b84a2c",
          700: "#983a23",
          800: "#7c3120",
          900: "#672b1f",
        },
        ink: {
          50: "#f7f6f5",
          100: "#e8e5e2",
          200: "#d1cbc5",
          300: "#aea39a",
          400: "#857868",
          500: "#685c4e",
          600: "#534a3f",
          700: "#453e35",
          800: "#3a342e",
          900: "#211e1a",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(103, 43, 31, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
