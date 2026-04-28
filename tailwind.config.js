/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nova: {
          // ── Dark mode ──────────────────────────
          bg:      '#08080f',
          surface: '#0f0f1a',
          card:    '#16162a',
          border:  '#2a2a45',
          text:    '#e2e2f0',
          muted:   '#6b6b8a',

          // ── Light mode ─────────────────────────
          'light-bg':      '#f4f4fb',
          'light-surface': '#ffffff',
          'light-card':    '#eeeef8',
          'light-border':  '#d8d8ee',
          'light-text':    '#12121e',
          'light-muted':   '#7070a0',
        },

        // ── Accents disponibles ─────────────────
        accent: {
          violet:  '#7c6aff',
          blue:    '#3b82f6',
          green:   '#10b981',
          orange:  '#f59e0b',
          pink:    '#ec4899',
          red:     '#ef4444',
          silver:  '#94a3b8',
        },

        // ── Paneles sidebar ─────────────────────
        hub:     '#10b981',
        ai:      '#7c6aff',
        marks:   '#f59e0b',
        history: '#3b82f6',
        ext:     '#ec4899',
        dl:      '#06b6d4',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      boxShadow: {
        'glow':     '0 0 20px var(--accent-glow)',
        'glow-sm':  '0 0 10px var(--accent-glow)',
        'glow-hub': '0 0 15px #10b98130',
        'glow-ai':  '0 0 15px #7c6aff30',
        'glow-dl':  '0 0 15px #06b6d430',
      },

      animation: {
        'pulse-slow':  'pulse 3s ease-in-out infinite',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite alternate',
        'slide-in':    'slideIn 0.2s ease-out',
        'fade-in':     'fadeIn 0.15s ease-out',
      },

      keyframes: {
        glowPulse: {
          '0%':   { boxShadow: '0 0 5px var(--accent-glow)' },
          '100%': { boxShadow: '0 0 20px var(--accent-color)' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(10px)', opacity: 0 },
          '100%': { transform: 'translateX(0)',    opacity: 1 },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}