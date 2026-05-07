import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./apps/web/app/**/*.{ts,tsx}', './apps/web/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          500: '#f97316',
          700: '#c2410c',
        },
      },
    },
  },
  plugins: [],
};

export default config;
