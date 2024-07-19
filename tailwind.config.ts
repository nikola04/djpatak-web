import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shakeX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(3px)' },
        }
      },
      scale: {
        '102': '1.02'
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
          pure: "#000000",
          light: "#212126"
        },
        gray: "#3e3e43",
        blue: {
          light: "#7e7ef0"
        }
      },
      backgroundColor: {
        white: {
          default: "#ffffff",
          "hover": "rgba(240, 240, 240, .13)",
          "active": "rgba(240, 240, 240, .2)",
        },
        black: {
          default: "#131319",
          pure: "#000000",
          light: "#212126"
        },
        blue: {
          sky: "#9c9cf7",
          light: "#7e7ef0"
        }
      },
      ringColor: {
        blue: "#aeaefb"
      }
    },
  },
  plugins: [],
};
export default config;
