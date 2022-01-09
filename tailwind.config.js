module.exports = {
  purge:["./src/**/*.vue"],
  content: [],
  theme: {

    extend: {
      lineHeight:{
        '5.25':'5.25'
      },
      margin:{
        'menu':'20px',
        'social':'11px',
        'nav':'135px',
      },
      fontSize:{
        'h1':['74px', {
          lineHeight: '84px',
          letterSpacing: '0.2px'}],
        'h2':['48px', {
          lineHeight: '55px',
          letterSpacing: '0.2px'}],
        'h3':['28px', {
          lineHeight: '40px',
          letterSpacing: '0.2px'}],
        'h4':['20px', {
          lineHeight: '20px',
          letterSpacing: '0.2px'}],
        'link':['15px', {
          lineHeight: '28px',
          letterSpacing: '0.2px'}],
        'mobile-menu':['30px', {
          lineHeight: '45px',
          letterSpacing: '0.2px'}],
        },
      fontFamily: {
        'Graphik': ['Graphik'],
      },
      colors: {
        blue: {
          primary: '#2091F9',
        },
        green: {
          secondary: '#2DC071',
        },
        orange:{
          secondary:'#F15B07',
        },
        text:{
          primary:'#252B42',
          secondary:'#374754',
          light:'#FFFFFF',

        },
        background:{
          dark:'#252B42',
          light:'#FFFFFF',
          gradient:'#222B3'
        },
      }
    },
      
  },
  plugins: [
    require('tailwindcss-pixel-dimensions')({
      width:{
        total:1900,
      },
      height:{
        total:1900,
      },
      fontSize:{
        total:99
      }
    })
  ],
}
