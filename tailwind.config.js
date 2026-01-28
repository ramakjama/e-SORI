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
        // ========================================
        // SORIANO BRAND - From Official Logo
        // ========================================
        soriano: {
          // Primary grays from logo
          DEFAULT: '#808080',
          gray: '#808080',
          'gray-light': '#a7a5a5',
          'gray-lighter': '#c5c4c4',
          'gray-dark': '#5a5a5a',
          'gray-darker': '#3a3a3a',
          dark: '#1a1a1a',
          // Professional blue accent
          blue: '#4A90E2',
          'blue-light': '#6FA8EC',
          'blue-dark': '#2E6DB8',
        },

        // ========================================
        // SEMANTIC COLORS - Professional palette
        // ========================================
        brand: {
          primary: '#808080',
          'primary-light': '#a7a5a5',
          'primary-dark': '#5a5a5a',
          accent: '#4A90E2',
          'accent-light': '#6FA8EC',
          'accent-dark': '#2E6DB8',
        },

        // Action color (replaces old primary)
        primary: {
          DEFAULT: '#4A90E2',
          50: '#EBF4FC',
          100: '#D7E9F9',
          200: '#AFD3F3',
          300: '#87BDED',
          400: '#6FA8EC',
          500: '#4A90E2',
          600: '#2E6DB8',
          700: '#23528C',
          800: '#183760',
          900: '#0C1C34',
        },

        // ========================================
        // STATE COLORS - Consistent semantics
        // ========================================
        success: {
          DEFAULT: '#2FBF97',
          light: '#50D4AE',
          dark: '#258F72',
          bg: '#E8F8F3',
        },
        warning: {
          DEFAULT: '#E0B04A',
          light: '#EBC46F',
          dark: '#B8913C',
          bg: '#FDF5E6',
        },
        danger: {
          DEFAULT: '#E30613',
          light: '#F43F47',
          dark: '#B8050F',
          bg: '#FEE7E8',
        },
        info: {
          DEFAULT: '#4A90E2',
          light: '#6FA8EC',
          dark: '#2E6DB8',
          bg: '#EBF4FC',
        },

        // ========================================
        // LEGACY - Backward compatibility
        // ========================================
        occident: {
          DEFAULT: '#4A90E2', // Redirect to new blue accent
          50: '#EBF4FC',
          100: '#D7E9F9',
          200: '#AFD3F3',
          300: '#87BDED',
          400: '#6FA8EC',
          500: '#4A90E2',
          600: '#2E6DB8',
          700: '#23528C',
          800: '#183760',
          900: '#0C1C34',
        },
        accent: {
          blue: '#4A90E2',
          green: '#2FBF97',
          orange: '#E0B04A',
          red: '#E30613',
          purple: '#8B7FD6',
          pink: '#FF6B9D',
          teal: '#5AC8FA',
          indigo: '#5856D6',
        },

        // ========================================
        // NEUTRAL GRAYS - Professional scale
        // ========================================
        gray: {
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E8E9EA',
          300: '#D1D3D5',
          400: '#C5C4C4',
          500: '#A7A5A5',
          600: '#808080',
          700: '#5A5A5A',
          800: '#3A3A3A',
          900: '#1A1A1A',
          950: '#0A0A0A',
        },
      },

      // ========================================
      // FONT FAMILY
      // ========================================
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        ui: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'Liberation Mono', 'ui-monospace', 'monospace'],
      },

      // ========================================
      // FONT SIZE - Mobile optimized
      // ========================================
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.16' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
      },

      // ========================================
      // SPACING - Consistent rhythm
      // ========================================
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      },

      // ========================================
      // BORDER RADIUS - App style
      // ========================================
      borderRadius: {
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      // ========================================
      // BOX SHADOW - Premium depth
      // ========================================
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'elevated': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 20px rgba(79, 163, 255, 0.25)',
        'glow-success': '0 0 20px rgba(47, 191, 151, 0.25)',
        'glow-danger': '0 0 20px rgba(208, 91, 91, 0.25)',
        'glow-warning': '0 0 20px rgba(224, 176, 74, 0.25)',
        'inner-glow': 'inset 0 0 20px rgba(79, 163, 255, 0.1)',
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'premium-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
      },

      // ========================================
      // BACKDROP BLUR
      // ========================================
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '20px',
        '2xl': '40px',
      },

      // ========================================
      // ANIMATION
      // ========================================
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'fade-in-down': 'fadeInDown 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'slide-left': 'slideLeft 0.4s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 1s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },

      // ========================================
      // KEYFRAMES
      // ========================================
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(79, 163, 255, 0.25)' },
          '50%': { boxShadow: '0 0 40px rgba(79, 163, 255, 0.5)' },
        },
      },

      // ========================================
      // BACKGROUND IMAGE
      // ========================================
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, var(--brand-titanium) 0%, var(--brand-chrome) 100%)',
        'gradient-primary': 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
      },

      // ========================================
      // Z-INDEX
      // ========================================
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // ========================================
      // TRANSITION
      // ========================================
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
