import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1100px'
      }
    },
    extend: {
      colors: {
        bg: '#0b0f14',
        fg: '#e7edf4',
        muted: '#98a7b8',
        primary: '#4c8bf5',
        card: '#121821',
        border: '#1e2733'
      },
      borderRadius: {
        lg: '10px'
      }
    }
  },
  plugins: []
};

export default config;
