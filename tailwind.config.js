/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xlm: { min: '1025px', max: '1200px' }, // Breakpoint custom untuk 1025px
      },
      colors: {
        'primary': '#003285',
        'secondary': '#2A629A',
        'tird':'#FF7F3E',
        'forth':'#FFDA78',
      },
      zIndex: {
        1000: '1000',
        1001: '1001',
        1002: '1002',
      },
    },
  },
  plugins: [],
}

