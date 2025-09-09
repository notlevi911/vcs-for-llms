/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern dark theme colors
        'dark-bg': '#0a0a0a',
        'dark-surface': '#111111',
        'dark-surface-2': '#1a1a1a',
        'dark-surface-3': '#262626',
        'dark-border': '#333333',
        'dark-border-light': '#404040',
        
        // Accent colors
        'accent-primary': '#6366f1', // Indigo
        'accent-primary-hover': '#4f46e5',
        'accent-secondary': '#10b981', // Emerald
        'accent-secondary-hover': '#059669',
        'accent-danger': '#ef4444', // Red
        'accent-danger-hover': '#dc2626',
        
        // Text colors
        'text-primary': '#ffffff',
        'text-secondary': '#a3a3a3',
        'text-muted': '#737373',
        
        // Message colors
        'message-user': '#6366f1',
        'message-assistant': '#1f2937',
        'message-assistant-border': '#374151',
        
        // Glass morphism
        'glass-bg': 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'modern': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
