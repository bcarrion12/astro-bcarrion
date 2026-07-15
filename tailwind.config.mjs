/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Manrope', 'sans-serif']
      },
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        border: 'var(--border)',
        'border-soft': 'var(--borderSoft)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accentHover)',
        'nav-bg': 'var(--navBg)'
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' }
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        drift: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '50%': { transform: 'translate(0,-10px)' }
        },
        ripple: {
          from: { transform: 'scale(0)', opacity: '.5' },
          to: { transform: 'scale(1)', opacity: '0' }
        }
      },
      animation: {
        breathe: 'breathe 3.5s ease-in-out infinite',
        fadeUp: 'fadeUp .6s ease-out forwards',
        drift: 'drift 8s ease-in-out infinite',
        ripple: 'ripple .6s ease-out forwards'
      }
    }
  },
  plugins: []
};
