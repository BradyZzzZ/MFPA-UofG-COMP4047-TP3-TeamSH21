/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        actionPrimary: '#041295',
        actionSecondary: '#000000b3',
        actionTertiary: '#f7f7f5',
        textBlack: '#333344',
        textWhite: '#f7f7f9',
        surface: '#f7f7f9e6',
        warning: '#e01e00',
        disabled: '#797d9c',
        blue: {
          DEFAULT: '#041295',
          50: '#e6e7f4',
          100: '#cdd0ea',
          200: '#9ba1d5',
          300: '#6871bf',
          400: '#3642aa',
          500: '#041295',
          600: '#030f77',
          700: '#020b59',
          800: '#02083c',
          900: '#01041e',
        },
        green: {
          DEFAULT: '#178244',
          50: '#e8f3ed',
          100: '#d1e6da',
          200: '#a2cdb4',
          300: '#74b48f',
          400: '#459b69',
          500: '#178244',
          600: '#126836',
          700: '#0e4e29',
          800: '#09341b',
          900: '#051a0e',
        },
        orange: {
          DEFAULT: '#e07900',
          50: '#fcf2e6',
          100: '#f9e4cc',
          200: '#f3c999',
          300: '#ecaf66',
          400: '#e69433',
          500: '#e07900',
          600: '#b36100',
          700: '#864900',
          800: '#5a3000',
          900: '#2d1800',
        },
        red: {
          DEFAULT: '#e01e00',
          50: '#fce9e6',
          100: '#f9d2cc',
          200: '#f3a599',
          300: '#ec7866',
          400: '#e64b33',
          500: '#e01e00',
          600: '#b31800',
          700: '#861200',
          800: '#5a0c00',
          900: '#2d0600',
        },
        bluegray: {
          DEFAULT: '#5d607e',
          25: '#f7f7f9',
          50: '#eeeff3',
          100: '#dedee6',
          200: '#bcbece',
          300: '#9a9db5',
          400: '#797d9c',
          500: '#5d607e',
          600: '#4a4d65',
          700: '#383a4b',
          750: '#333344',
          800: '#252733',
          900: '#131319',
        },
        lightblue: {
          DEFAULT: '#00bbdd',
          50: '#e6f8fc',
          100: '#ccf2f8',
          200: '#99e4f1',
          300: '#66d7eb',
          400: '#33c9e4',
          500: '#00bbdd',
          600: '#0096b1',
          700: '#007185',
          800: '#004b58',
          900: '#00262c',
        },
        purple: {
          DEFAULT: '#ae2573',
          50: '#f7e9f1',
          100: '#efd3e3',
          200: '#dfa8c7',
          300: '#ce7cab',
          400: '#be518f',
          500: '#ae2573',
          600: '#8b1e5c',
          700: '#681e5c',
          800: '#460f2e',
          900: '#230717',
        },
        yellow: {
          DEFAULT: '#fdda24',
          50: '#fffbe9',
          100: '#fff8d3',
          200: '#fef0a7',
          300: '#fee97c',
          400: '#fde150',
          500: '#fdda24',
          600: '#caae1d',
          700: '#988316',
          800: '#65570e',
          900: '#332c07',
        },
      },
      animation: {
        'fade-in':
          'fade-in 0.25s cubic-bezier(0.190, 1.000, 0.220, 1.000) both',
        'fade-out':
          'fade-out 0.25s cubic-bezier(0.190, 1.000, 0.220, 1.000) both',
        'slide-in-left':
          'slide-in-left 0.5s cubic-bezier(0.230, 1.000, 0.320, 1.000) both',
        'slide-in-right':
          'slide-in-right 0.5s cubic-bezier(0.230, 1.000, 0.320, 1.000) both',
        'scale-in-center':
          'scale-in-center 0.15s cubic-bezier(0.075, 0.820, 0.165, 1.000) both',
        'scale-up-top':
          'scale-up-top 0.4s cubic-bezier(0.165, 0.840, 0.440, 1.000) both',
        'show-side-panel':
          'show-side-panel 0.3s cubic-bezier(0.230, 1.000, 0.320, 1.000) both',
        'hide-side-panel':
          'hide-side-panel 0.3s cubic-bezier(0.230, 1.000, 0.320, 1.000) both',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'fade-out': {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        'slide-in-left': {
          '0%': {
            transform: 'translateX(-200px)',
            opacity: '0.5',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'slide-in-right': {
          '0%': {
            transform: 'translateX(200px)',
            opacity: '0.5',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'scale-in-center': {
          '0%': {
            transform: 'scale(0.7)',
            opacity: '0',
          },
          to: {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        'scale-up-top': {
          '0%': {
            transform: 'scale(.5)',
            'transform-origin': '50% 0%',
          },
          to: {
            transform: 'scale(1)',
            'transform-origin': '50% 0%',
          },
        },
        'show-side-panel': {
          '0%': {
            transform: 'translateX(-480px)',
          },
          to: {
            transform: 'translateX(0px)',
          },
        },
        'hide-side-panel': {
          '0%': {
            transform: 'translateX(0)',
          },
          to: {
            transform: 'translateX(-480px)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [require('daisyui'), nextui()],
  daisyui: {
    themes: ['light'],
  },
};
