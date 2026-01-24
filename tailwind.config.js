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
        // Occident Red - Color corporativo
        occident: {
          DEFAULT: '#E30613',
          50: '#FEE7E8',
          100: '#FDCFD1',
          200: '#FA9FA3',
          300: '#F76F75',
          400: '#F43F47',
          500: '#E30613',
          600: '#B8050F',
          700: '#8D040C',
          800: '#620308',
          900: '#370204',
        },
        // Paleta Apple
        apple: {
          black: '#000000',
          white: '#ffffff',
          'gray-900': '#1d1d1f',
          'gray-800': '#2d2d2f',
          'gray-700': '#424245',
          'gray-600': '#6e6e73',
          'gray-500': '#86868b',
          'gray-400': '#aeaeb2',
          'gray-300': '#c7c7cc',
          'gray-200': '#d1d1d6',
          'gray-100': '#e5e5ea',
          'gray-50': '#f5f5f7',
        },
        // Primary basado en Occident
        primary: {
          50: '#fef7f6',
          100: '#fdecea',
          200: '#fbd5d1',
          300: '#f7b3ab',
          400: '#f28579',
          500: '#E30613',
          600: '#B8050F',
          700: '#8D040C',
          800: '#620308',
          900: '#370204',
        },
        // Colores de acento
        accent: {
          blue: '#007AFF',
          green: '#34C759',
          orange: '#FF9500',
          purple: '#AF52DE',
          pink: '#FF2D55',
          teal: '#5AC8FA',
          indigo: '#5856D6',
        },
        soriano: {
          gray: '#808080',
          'gray-light': '#a7a5a5',
          dark: '#1a1a1a',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'premium-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        'glow': '0 0 20px rgba(227, 6, 19, 0.3)',
        'glow-blue': '0 0 20px rgba(0, 122, 255, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 1s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(227, 6, 19, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(227, 6, 19, 0.6)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      },
    },
  },
  plugins: [],
}
