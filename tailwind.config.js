module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'baghchal-dark': '#24252D',
        'baghchal-gray-1': '#E3E1E3',
        'baghchal-gray-2': '#888888',
        'baghchal-gray-3': '#4F4F4F',
        'baghchal-black-1': '#2D2E36',
        'baghchal-black-2': '#1B1A21',
        'baghchal-black-3': '#2A2D3A',
        'baghchal-black-4': '#24252D',
        'sidebar-bg-dark': '#272522',
        'page-bg-dark': '#312E2B',
        'status-bg-dark': '#272522',
        'sidebar-bg-light': '#E5E7EB',
        'page-bg-light': '#F9FAFB',
        'status-bg-light': '#E5E7EB',
        'baghchal-red-violet': '#DA18A3',
        'overlay-black': 'rgba(0, 0, 0, 0.8)',
      },
      width: {
        215: '215px',
        357: '357px',
        557: '557px',
      },
      minWidth: {
        155: '155px',
        190: '190px',
        215: '215px',
        240: '240px',
        256: '256px',
        327: '327px',
      },
      height: {
        300: '300px',
        557: '557px',
      },
      inset: {
        45: '45%',
        65: '65px',
      },
      spacing: {
        65: '65px',
      },
      flex: {
        2: '2 2 0%',
      },
      lineHeight: {
        70: '70px',
      },
      zIndex: {
        '-5': '-5',
        0: '0',
      },
    },
    screens: {
      lg: { max: '1800px' },
      md: { max: '990px' },
      sm: { max: '600px' },
      xs: { max: '400px' },
      minmd: '1700px',
      minlg: '2100px',
    },
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
