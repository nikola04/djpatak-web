import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shakeX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(3px)' },
        }
      },
      animation: {
        shakeX: "shakeX .25s ease-in"
      },
      backgroundImage: {
        "default-gradient": "linear-gradient(140deg, #202c42 0%, #222e46 35%, #203649 100%)"
      },
      colors: {
        "white": {
          default: "#ffffff",
          "gray": "#f0f0f0"
        }
      },
      borderColor: {
        black: {
          default: "#131319",
          pure: "#000000"
        },
        gray: "#3e3e43",
        blue: {
          light: "#7e7ef0"
        }
      },
      backgroundColor: {
        white: {
          default: "#ffffff",
          "hover": "rgba(240, 240, 240, .25)",
          "active": "rgba(240, 240, 240, .35)",
        },
        black: {
          default: "#131319",
          pure: "#000000",
          light: "#212126"
        },
        blue: {
          light: "#7e7ef0"
        }
      }
    },
  },
  plugins: [],
};
export default config;
