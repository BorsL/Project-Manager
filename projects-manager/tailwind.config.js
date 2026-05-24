/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F3EA',
        surface: '#FFFDF8',
        ink: '#181C18',
        muted: '#667067',
        line: '#DED8CB',
        accent: '#256D85',
        'accent-soft': '#D9EDF2',
        success: '#2F7D50',
        warning: '#A35F18',
        danger: '#B74343',
      },
      borderRadius: {
        usm: '8px',
      },
      fontFamily: {
        sans: ['system-ui'],
      },
    },
  },
  plugins: [],
};
