module.exports = {
  future: {
    respectDefaultRingColorOpacity: false,
  },
  experimental: {
    optimizeUniversalDefaults: false,
  },
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
          fontFamily: {
            arial: ['"Arial"', 'sans-serif'],
          }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
