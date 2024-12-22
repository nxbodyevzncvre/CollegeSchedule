/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-to-hover': 'linear-gradient(#F4F3E5, #F4F3E5)',
      },
      colors:{
        nedoblack: "#2c2c2c",
        nedowhite: "#F4F3E5",
      },
      fontFamily:{
        recursive: ["Recursive"],
        montserrat:["Montserrat"],
      },
      keyframes: {
        'fill-center': {
          '0%': { 'background-size': '0% 0%' },
          '100%': { 'background-size': '100% 100%' },
        },
      },
      animation: {
        'fill-center': 'fill-center 0.3s forwards',
      },
    },
  },
  plugins: [],
};
