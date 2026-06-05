/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stitch: {
          bg: '#F8FAFC',        // Slate background
          sidebar: '#F1F5F9',   // Light gray sidebar
          primary: '#0B57D0',   // Google/Stitch blue
          primaryHover: '#0842A0',
          record: '#B3261E',    // Recording red
          recordHover: '#8C1D18',
          text: '#1E293B',      // Dark slate text
          muted: '#64748B',     // Cool gray text
          border: '#E2E8F0',    // Slate border
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
