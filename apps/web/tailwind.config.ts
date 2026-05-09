import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: {
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
        fg: {
          1: 'var(--fg-1)',
          2: 'var(--fg-2)',
          3: 'var(--fg-3)',
          4: 'var(--fg-4)',
          'on-accent': 'var(--fg-on-accent)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          press: 'var(--accent-press)',
          soft: 'var(--accent-soft)',
        },
        border: {
          1: 'var(--border-1)',
          2: 'var(--border-2)',
          strong: 'var(--border-strong)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        info: 'var(--info)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        serif: ['var(--font-serif)'],
      },
      fontSize: {
        display: 'var(--fs-display)',
        h1: 'var(--fs-h1)',
        h2: 'var(--fs-h2)',
        h3: 'var(--fs-h3)',
        body: 'var(--fs-body)',
        'body-sm': 'var(--fs-body-sm)',
        label: 'var(--fs-label)',
        data: 'var(--fs-data)',
        micro: 'var(--fs-micro)',
      },
      spacing: {
        1: 'var(--sp-1)',
        2: 'var(--sp-2)',
        3: 'var(--sp-3)',
        4: 'var(--sp-4)',
        5: 'var(--sp-5)',
        6: 'var(--sp-6)',
        7: 'var(--sp-7)',
        8: 'var(--sp-8)',
        9: 'var(--sp-9)',
        10: 'var(--sp-10)',
      },
      borderRadius: {
        1: 'var(--r-1)',
        2: 'var(--r-2)',
        3: 'var(--r-3)',
        4: 'var(--r-4)',
        5: 'var(--r-5)',
        pill: 'var(--r-pill)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
        panel: 'var(--dur-panel)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },
      zIndex: {
        map: 'var(--z-map)',
        overlay: 'var(--z-overlay)',
        panel: 'var(--z-panel)',
        sheet: 'var(--z-sheet)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
      },
      boxShadow: {
        1: 'var(--shadow-1)',
        2: 'var(--shadow-2)',
        3: 'var(--shadow-3)',
        panel: 'var(--shadow-panel)',
      },
    },
  },
  plugins: [],
};

export default config;
