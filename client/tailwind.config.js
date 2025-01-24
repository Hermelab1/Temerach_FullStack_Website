/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'blog': '0 2px 5px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        rightToLeft: 'rightToLeft 3s ease-in forwards',
        'move-left': 'moveLeft 1s linear forwards',
        'move-right': 'moveRight 1s linear forwards',
        'moveline': 'moveline 7s linear forwards',
      },
      keyframes: {
        rightToLeft: {
          '0%': { 
            transform: 'translateX(100%)', // Start from off the right side
            opacity: 0.1 // Blurred (faded out) at start
          },
          '100%': { 
            transform: 'translateX(0)', // End at the final position
            opacity: 1 // Fully opaque at end
          },
        },
        moveLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        moveRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        moveline: {
          '0%': { height: '0' },
          '100%': { height: '60%' },
        },
      },
      fontFamily: {
        'Cardo': ['Cardo', 'serif'], 
        'Poppins':['Poppins','sans-serif'], // Add this line
      },
      fontWeight:{
        'semimudium': '490',
      },
      screens:{
        'maxm':'820px',
        'slg': '912px',
        'rot': '932px',
        'tab':'1024px'
      }
    },
  },
  plugins: [],
}