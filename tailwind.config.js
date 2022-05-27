module.exports = {
  mode: 'jit',
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  theme: {
    fontFamily: {
      sans: ['FB Hermes', 'sans-serif'],
    },
    extend: {
      colors: {
        'sl-yellow': '#fcb94c',
        'sl-flamingo': '#f0585d',
        'sl-turquis': '#2398a0',
        'sl-darkblue': '#002f66',
      },
      gridTemplateColumns: {
        calendar: '5% 12% 12% 12% 12% 12% 12% 12%',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            h2: {
              fontSize: '1.1em',
              marginBottom: '0.5em',
            },
            h3: {
              fontSize: '1em',
              marginBottom: '0.4em',
            },
          },
        },
      }),
    },
  },
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
  important: '#catalog',
  corePlugins: {
    preflight: false,
  },
  content: ['src/App.svelte', './src/**/*.svelte'],
  daisyui: {
    themes: ['light'],
  },
}
