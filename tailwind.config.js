/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      monospace: ["Amiga"],
    },
    extend: {
      gridTemplateColumns: {
        supaplex: "repeat(60, 32px)",
      },
    },
  },
  plugins: [],
};
