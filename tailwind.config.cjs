/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const { blackA, mauve, violet } = require("@radix-ui/colors");

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
      colors: {
        ...blackA,
        ...mauve,
        ...violet,
      },
      keyframes: {
        "heart-burst": {
          from: { "background-position": "left" },
          to: { "background-position": "right" },
        },
        // Dropdown menu
        dropdownSlideDownAndFade: {
          from: { opacity: 0, transform: "translateY(-2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        dropdownSlideLeftAndFade: {
          from: { opacity: 0, transform: "translateX(2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        dropdownSlideUpAndFade: {
          from: { opacity: 0, transform: "translateY(2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        dropdownSlideRightAndFade: {
          from: { opacity: 0, transform: "translateX(2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        "heart-burst": "heart-burst .8s steps(28) 1",
        // Dropdown menu
        dropdownSlideDownAndFade:
          "dropdownSlideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        dropdownSlideLeftAndFade:
          "dropdownSlideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        dropdownSlideUpAndFade:
          "dropdownSlideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        dropdownSlideRightAndFade:
          "dropdownSlideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-radix")(),
    require("@tailwindcss/line-clamp"),
  ],
};
