import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
      colors: {
        canvas: "#f6f1e7",
        ink: "#1a1a1a",
        gold: "#b8893a",
      },
    },
  },
  plugins: [],
};

export default config;
