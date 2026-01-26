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
        // APP - Fondos y superficies
        // ========================================
        app: {
          bg: 'var(--app-bg)',
          bg2: 'var(--app-bg-2)',
          surface: 'var(--app-surface)',
          surfaceHover: 'var(--app-surface-hover)',
          elevated: 'var(--app-elevated)',
          border: 'var(--app-border)',
          divider: 'var(--app-divider)',
        },

        // ========================================
        // T - Sistema de texto
        // ========================================
        t: {
          strong: 'var(--text-strong)',
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
          disabled: 'var(--text-disabled)',
        },

        // ========================================
        // BRAND - Platas del logo Soriano
        // ========================================
        brand: {
          silver: 'var(--brand-silver)',
          chrome: 'var(--brand-chrome)',
          titanium: 'var(--brand-titanium)',
        },

        // ========================================
        // PRIMARY - Acción (azul tech)
        // ========================================
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          active: 'var(--primary-active)',
          soft: 'var(--primary-soft-bg)',
        },

        // ========================================
        // STATE - Estados operativos
        // ========================================
        state: {
          success: 'var(--success)',
          successBg: 'var(--success-bg)',
          warning: 'var(--warning)',
          warningBg: 'var(--warning-bg)',
          danger: 'var(--danger)',
          dangerBg: 'var(--danger-bg)',
          info: 'var(--info)',
          infoBg: 'var(--info-bg)',
        },

        // ========================================
        // LEGACY - Compatibilidad con código existente
        // ========================================
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
        accent: {
          blue: '#4FA3FF',
          green: '#2FBF97',
          orange: '#E0B04A',
          red: '#D05B5B',
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
