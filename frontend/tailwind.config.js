/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FAF9F6', // Claude-like warm off-white
          text: '#111111', // Charcoal black
          muted: '#666666', // Gray
          border: '#E5E5E0', // Light warm gray
          accent: '#D97706', // Warm amber
          accentHover: '#B45309', // Darker amber
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
