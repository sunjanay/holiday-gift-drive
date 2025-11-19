import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        century: [
          'Century Gothic',
          'CenturyGothic',
          'AppleGothic',
          'sans-serif',
        ],
      },
      colors: {
        // Foster Greatness Brand Colors
        'fg-navy': '#1a2949',        // Primary Navy Blue
        'fg-teal': '#0067a2',        // Primary Teal Blue
        'fg-light-blue': '#ddf3ff',  // Light Blue
        'fg-orange': '#fa8526',      // Accent Orange
        'fg-yellow': '#faca2c',      // Accent Yellow
        'fg-accent-teal': '#00c8b7', // Accent Teal/Blue

        // Holiday colors (keeping for gingerbread theme)
        holiday: {
          red: '#c41e3a',
          green: '#165b33',
          gold: '#ffd700',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
