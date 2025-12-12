/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(0, 0%, 100%)',
        foreground: 'hsl(20, 14.3%, 4.1%)',
        muted: 'hsl(60, 4.8%, 95.9%)',
        'muted-foreground': 'hsl(25, 5.3%, 44.7%)',
        popover: 'hsl(0, 0%, 100%)',
      },
    },
  },
  plugins: [],
}

