import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        paper: "#FBFAF7",
        "paper-dark": "#15130F",
        ink: "#191817",
        "ink-dark": "#F1EFE9",
        oxblood: {
          DEFAULT: "#6E1F24",
          light: "#8A3138",
          dark: "#4C1418",
        },
        hairline: "#DDD8CC",
        "hairline-dark": "#33302A",
        muted: "#6B6A62",
        "muted-dark": "#A6A296",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"],
        sans: ["var(--font-plex)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            maxWidth: "68ch",
          },
        },
      }),
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
