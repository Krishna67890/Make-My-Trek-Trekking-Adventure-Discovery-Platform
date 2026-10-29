/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pastelYellow: '#FFE48C',
          primaryYellow: '#FFC800',
          orange: '#D79700',
          secondaryOrange: '#E8B42A',
          grayBrown: '#7C4B23',
          lightYellow: '#FED547',
          black: '#000000',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        heading: ['"Architects Daughter"', 'cursive', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'brand': '0 8px 30px rgba(215, 151, 0, 0.15)',
        'card': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        'bubble': '4px 4px 0px #000000',
      }
    },
  },
  plugins: [],
}
