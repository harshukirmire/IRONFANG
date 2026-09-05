/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      colors: {
        // ── IRONFANG Core Palette ──
        background: '#08090D',
        foreground: '#F5F5F5',
        card: {
          DEFAULT: '#11131A',
          foreground: '#F5F5F5',
        },
        popover: {
          DEFAULT: '#1B1F29',
          foreground: '#F5F5F5',
        },
        primary: {
          DEFAULT: '#E63946',        // Bright crimson — main accent
          foreground: '#F5F5F5',
        },
        secondary: {
          DEFAULT: '#8B5CF6',        // Electric purple
          foreground: '#F5F5F5',
        },
        accent: {
          DEFAULT: '#A78BFA',        // Electric lavender
          foreground: '#08090D',
        },
        destructive: {
          DEFAULT: '#E63946',
          foreground: '#F5F5F5',
        },
        muted: {
          DEFAULT: '#1B1F29',
          foreground: '#9CA3AF',
        },
        border: '#2A2F3A',
        input: '#1B1F29',
        ring: '#E63946',
        // Named tokens
        'panel-dark': '#0D0E13',
        'gunmetal': '#2A2F3A',
        'deep-crimson': '#8B1E2D',
        'bright-crimson': '#E63946',
        'electric-purple': '#8B5CF6',
        'electric-lavender': '#A78BFA',
      },
      fontFamily: {
        display: ['Rajdhani', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'Chivo Mono', 'monospace'],
        body: ['Space Grotesk', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fang-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.8' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.9' },
          '97%': { opacity: '1' },
        },
        'border-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(230,57,70,0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(230,57,70,0.8)' },
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fang-pulse': 'fang-pulse 3s ease-in-out infinite',
        'scan-line': 'scan-line 8s linear infinite',
        'flicker': 'flicker 4s linear infinite',
        'border-glow': 'border-glow 2s ease-in-out infinite',
      },
      backgroundImage: {
        'crimson-gradient': 'linear-gradient(135deg, #8B1E2D 0%, #E63946 100%)',
        'purple-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
        'dark-gradient': 'linear-gradient(180deg, #08090D 0%, #11131A 100%)',
        'panel-gradient': 'linear-gradient(135deg, #11131A 0%, #1B1F29 100%)',
      },
      boxShadow: {
        'crimson': '0 0 20px rgba(230, 57, 70, 0.4)',
        'crimson-lg': '0 0 40px rgba(230, 57, 70, 0.6)',
        'purple': '0 0 20px rgba(139, 92, 246, 0.4)',
        'purple-lg': '0 0 40px rgba(139, 92, 246, 0.6)',
        'panel': '0 4px 32px rgba(0,0,0,0.6)',
        'inner-top': 'inset 0 2px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
