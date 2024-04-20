import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'light-blue': '#117E9F',
        'dark-blue': '#0E223F',
        'dark-orange': '#D55F19',
        'light-gray': '#F8F6F3'
      },
      fontFamily: {
        'sans': ['Noto Sans', 'ui-sans-serif'],
        'serif': ['Georgia', 'ui-serif']
      },
      fontSize: {
        xl: '1.625'
      }
    },
  },
  plugins: [],
} satisfies Config;
