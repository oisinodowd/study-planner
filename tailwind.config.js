/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7cfc7',
          300: '#a3b0a3',
          400: '#7d8f7d',
          500: '#5c735c', // Slightly desaturated
          600: '#4d5c4d',
          700: '#404b40',
          800: '#363e36',
          900: '#2f352f',
          950: '#171c17',
        },
        cream: {
          50: '#fefef9',
          100: '#fcfbf0',
          200: '#f6f2dd', // Slightly darker for readability
          300: '#f0e8c0',
          400: '#e7da9e',
          500: '#dcc97e',
          600: '#cfae5c',
          700: '#b89246',
          800: '#94763c',
          900: '#795f34',
          950: '#42321a',
        },
        midnight: {
          50: '#f4f6f7',
          100: '#e3e8ea',
          200: '#c9d4d8',
          300: '#a4b5bc',
          400: '#778e99',
          500: '#5c737e',
          600: '#4f606b',
          700: '#44515a',
          800: '#3d464d',
          900: '#363d43',
          950: '#1e2428',
        },
        terracotta: {
          50: '#fdf6f3',
          100: '#fbeae3',
          200: '#f8d8cb',
          300: '#f2bea7',
          400: '#e99a79',
          500: '#dd7a54',
          600: '#c95f3d',
          700: '#a84d32',
          800: '#8b422d',
          900: '#733a2a',
          950: '#3e1b12',
        },
        gold: {
          50: '#fffdf6',
          100: '#fefae0',
          200: '#f9f1b4',
          300: '#f2e08a', // Muted for readability
          400: '#e7cc61',
          500: '#d8b53d', // Deeper, more earthy
          600: '#c09b2e',
          700: '#a17e23',
          800: '#82641a',
          900: '#684f13',
          950: '#3c2b09',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Source Sans 3', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
