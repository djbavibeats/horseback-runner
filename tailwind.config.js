/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "press-start": '"Press Start 2P"',
        "snide-asides": '"Snide Asides"',
      },
      keyframes: {
        bounce: {
          '0%, 100%': { 
            transform: 'translateY(-5%)'
          },
        }
      },
      animation: {
        bounce: 'bounce 0.75s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}

