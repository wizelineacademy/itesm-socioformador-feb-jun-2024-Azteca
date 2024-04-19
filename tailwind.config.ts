import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
      },
      animation: {
        shake: "shake 1.5s ease-in-out infinite",
        spinSlow: "spin 2s ease-int-out infinite",
      },
      colors: {
        primary: {
          DEFAULT: "#6640D5",
          light: "#8671d3",
          dark: "#492aa9",
        },
        secondary: "#4598FB",
        bone: "#F8F5F5",
        graySubtitle: "#4A5660",
        grayText: "#9E9E9E",
        yellowSurvey: "#FEDE1C",
        blueSurvey: "#4598FB",
        redSurvey: "#EE2B55",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
