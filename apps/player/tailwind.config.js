/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      /**
       * Design tokens extracted from the 5 reference mockups.
       * Dark UI with gold/orange accents, gem-blue, coin-yellow, and type-based creature colors.
       */
      colors: {
        // Surfaces
        bg: {
          base: '#0B0D12',       // app background
          surface: '#111418',    // cards / sections background
          elevated: '#161A20',   // nested cards
          hover: '#1C2128',
        },
        border: {
          subtle: '#1F242C',
          strong: '#2A3038',
        },
        text: {
          primary: '#F4F5F7',
          secondary: '#A7ADBA',
          muted: '#6B7280',
          disabled: '#4B5563',
        },
        // Brand / accent
        accent: {
          DEFAULT: '#E0A83B',    // gold
          hover: '#F0B94A',
          deep: '#B07E1F',
          red: '#C04A3B',        // header/active-tab crimson seen in mockups
          redDark: '#8A2F25',
        },
        // Currencies / game
        gold: '#F5B73A',
        gem: '#4FC3F7',
        xp: '#3FA9F5',
        success: '#2EA043',
        danger: '#D9453C',
        warning: '#E0A83B',
        // Creature / type colors (collection cards)
        type: {
          fire: '#E85C3A',
          water: '#4FA8E0',
          grass: '#5BBF4A',
          electric: '#E8C244',
          poison: '#8A4FB8',
          dark: '#3E4454',
          ghost: '#C7C7D1',
          dragon: '#55B89C',
        },
        // Rarity badges (shop)
        rarity: {
          best: '#C04A3B',
          popular: '#6A2E7A',
          limited: '#B04A1E',
        },
      },
      fontFamily: {
        display: ['"Press Start 2P"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xxs': ['10px', '14px'],
      },
      borderRadius: {
        card: '12px',
        tile: '10px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 2px 0 0 rgba(0,0,0,0.4), 0 1px 0 0 rgba(255,255,255,0.03) inset',
        glow: '0 0 0 2px rgba(224,168,59,0.35)',
        glowRed: '0 0 0 2px rgba(192,74,59,0.45)',
        insetBar: 'inset 0 1px 2px rgba(0,0,0,0.6)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      maxWidth: {
        app: '420px', // mobile frame
      },
    },
  },
  plugins: [],
};
