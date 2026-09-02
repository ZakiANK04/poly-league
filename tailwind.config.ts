import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'pl-blue': '#05069D',        // Primary royal blue
        'pl-blue-accent': '#0F14C5', // Exact sampled bright blue
        'pl-blue-light': '#2529D8',  // Vibrant accent
        'pl-blue-dark': '#03036E',   // Dark navy blue shade
        'pl-black': '#050505',       // Heading true black
        'pl-body-bg': '#F6F6F6',     // Page off-white background
        'pl-gold-flat': '#A58B5C',   // Flat gold
        'pl-gold-start': '#DEBE76',  // Light gold
        'pl-gold-mid': '#8F703A',    // Dark gold
        'pl-green': '#037F13',       // Direct qualification (Rank 1-2)
        'pl-amber': '#CEA70D',       // Playoff zone (Rank 3-6)
        'pl-red': '#C90508',         // Eliminated zone (Rank 7-8)
      },
      fontFamily: {
        display: ['Sakana', 'Bebas Neue', 'Arial Narrow', 'Impact', 'sans-serif'],
        sakana: ['Sakana', 'Bebas Neue', 'Arial Narrow', 'Impact', 'sans-serif'],
        rugen: ['Sakana', 'Bebas Neue', 'Arial Narrow', 'Impact', 'sans-serif'],
        body: ['Aptos', 'Helvetica Neue', 'Segoe UI', 'sans-serif'],
      },
      backgroundImage: {
        'gold-pill': 'linear-gradient(90deg, #DEBE76 0%, #8F703A 50%, #DEBE76 100%)',
        'gold-sheen': 'linear-gradient(135deg, #DEBE76 0%, #8F703A 50%, #DEBE76 100%)',
        'blue-gradient': 'linear-gradient(180deg, #05069D 0%, #03036E 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
