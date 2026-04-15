import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAFA',
        fg: '#09090B',
        muted: '#71717A',
        border: '#E4E4E7',
        accent: '#D4A853',
        'accent-dark': '#B8923F',
        'dark-bg': '#0C0C0D',
        'dark-fg': '#F4F4F5',
        'dark-muted': '#A1A1AA',
        'dark-border': '#27272A',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        'fluid-sm': 'clamp(0.875rem, 1.5vw, 1rem)',
        'fluid-base': 'clamp(1rem, 2vw, 1.25rem)',
        'fluid-lg': 'clamp(1.25rem, 3vw, 2rem)',
        'fluid-xl': 'clamp(2rem, 5vw, 4rem)',
        'fluid-2xl': 'clamp(3rem, 8vw, 7rem)',
        'fluid-3xl': 'clamp(4rem, 12vw, 11rem)',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
