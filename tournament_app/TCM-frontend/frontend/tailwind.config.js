/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0EA5E9',
        'primary-dark': '#0B3D91',
        'accent-teal': '#06B6D4',
        'accent-coral': '#FF6B6B',
        gold: '#F59E0B',
        success: '#10B981',
        slate: '#475569',
        surface: '#F8FAFC',
        card: '#FFFFFF',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(14, 165, 233, 0.5), 0 0 40px rgba(14, 165, 233, 0.3)',
        'soft': '0 4px 6px -1px rgba(11, 61, 145, 0.08), 0 2px 4px -1px rgba(11, 61, 145, 0.06)',
        'shadow': '0 10px 15px -3px rgba(11, 61, 145, 0.08), 0 4px 6px -2px rgba(11, 61, 145, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
      },
    },
  },
  plugins: [],
}
