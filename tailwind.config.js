/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        'noto': ['Noto Sans', 'sans-serif'],
        'oxygen': ['Oxygen', 'sans-serif'],
        'open': ['Open Sans', 'sans-serif']
      }
    },
  },
  plugins: [
    require('tailwind-glassmorphism')
  ],
}