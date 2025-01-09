import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundColor:{
        'baseBackgroundL0': 'rgb(14 15 20 / var(--tw-bg-opacity, 1))',
        'baseBackgroundL2': 'rgb(32 33 39/var(--tw-bg-opacity,1))',
        'redBackgroundTransparent':'rgba(234,56,59,.12)',
        'baseBackgroundMed':'rgb(204 204 204 / var(--tw-border-opacity))'
      },
      textColor:{
        'redText':'rgb(253 75 78/var(--tw-text-opacity,1))',
        'greenText':'rgb(0 194 120/var(--tw-text-opacity,1))',
        'baseTextHighEmphasis':'rgb(244 244 246/var(--tw-text-opacity,1))',
        'baseTextMidEmphasis':'rgb(150 159 175 / var(--tw-text-opacity, 1))',
        
      },
      borderColor:{
        'redBorder':"rgba(234,56,59,.5)"
      }
    },
  },
  plugins: [],
} satisfies Config;
