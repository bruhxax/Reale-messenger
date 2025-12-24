/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'reale-black': '#000000',
        'reale-yellow': '#FFD700',
        'reale-orange': '#FF8C00',
        'reale-dark': '#121212',
        'reale-darker': '#0A0A0A',
        'reale-gray': '#2A2A2A',
        'reale-light-gray': '#3A3A3A',
      },
      borderRadius: {
        'reale-sm': '4px',
        'reale-md': '8px',
        'reale-lg': '12px',
        'reale-xl': '16px',
        'reale-full': '9999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
      },
    },
  },
  plugins: [],
};
