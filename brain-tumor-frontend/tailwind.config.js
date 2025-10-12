/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Include all Angular templates & TS files
    "./src/*.{html,ts,css}",
    "./src/**/**/*.{html,ts,css}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
