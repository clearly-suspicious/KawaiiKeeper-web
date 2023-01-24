/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      display: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        '"Noto Sans"',
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
    },
    extend: {
      keyframes: {
        "heart-burst": {
          from: { "background-position": "left" },
          to: { "background-position": "right" },
        },
      },
      animation: {
        "heart-burst": "heart-burst .8s steps(28) 1",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-radix")()],
};
