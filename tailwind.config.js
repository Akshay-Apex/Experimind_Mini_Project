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
          rose: {
            deep: '#893941',
            mid: '#CB7885',
            light: '#EFD7CF',
            blush: '#DDBAAE',
          },
          green: {
            sage: '#818263',
            olive: '#5E6623',
          },
          cream: {
            DEFAULT: '#FFFAF2',
            honey: '#F6EAD4',
            latte: '#DCD4C1',
          }
        }
      },
      fontFamily: {
        serif: ['Poppins', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
