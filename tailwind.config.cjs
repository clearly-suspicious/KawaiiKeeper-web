/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
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
  plugins: [require("@tailwindcss/typography")],
};
