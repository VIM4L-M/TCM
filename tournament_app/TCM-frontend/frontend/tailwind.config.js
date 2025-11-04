/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'tournament-blue': '#2563EB',
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1E40AF',
        },
        'deep-blue': '#1E40AF',
        'light-blue': '#DBEAFE',
        'extra-light-blue': '#EFF6FF',
        
        // Accent Colors
        'live-orange': '#F97316',
        success: '#10B981',
        'success-green': '#10B981',
        warning: '#F59E0B',
        'warning-amber': '#F59E0B',
        error: '#EF4444',
        'error-red': '#EF4444',
        gold: '#EAB308',
        'spirit-gold': '#EAB308',
        'accent-teal': '#14B8A6',
        'accent-coral': '#EF4444',
        
        // Neutral Colors
        text: {
          dark: '#0F172A',
          medium: '#475569',
          light: '#64748B',
        },
        slate: '#475569',
        background: {
          white: '#FFFFFF',
          light: '#F8FAFC',
          gray: '#F1F5F9',
        },
        surface: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'hero': ['56px', { lineHeight: '1.1', fontWeight: '700' }],
        'tournament': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'page-heading': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        'section-heading': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'card-title': ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        'live-score': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        'shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'lift': '0 20px 25px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'xl': '1rem',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
