/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      /**
       * Admin backoffice design system — deliberately DIFFERENT from the
       * player app. This is a desktop dashboard for content management, not
       * a mobile game UI. Light surface palette, neutral accents, dense
       * typography suited for tables and forms.
       */
      colors: {
        surface: {
          base: '#F6F7F9',     // page background
          elevated: '#FFFFFF', // cards, tables
          muted: '#EEF0F3',
          sidebar: '#111827',
          sidebarText: '#D1D5DB',
          sidebarTextActive: '#FFFFFF',
        },
        border: {
          subtle: '#E5E7EB',
          strong: '#D1D5DB',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
          onDark: '#F9FAFB',
        },
        brand: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          soft: '#E0ECFF',
        },
        status: {
          success: '#16A34A',
          warning: '#D97706',
          danger: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        card: '10px',
        control: '6px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
      },
    },
  },
  plugins: [],
};
