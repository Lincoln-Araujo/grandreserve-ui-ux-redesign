export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1B365D",      // azul UNFCCC
        primaryLight: "#2C4F85",
        primaryDark: "#11233F",
        accent: "#5FA4A6",       // tom secundário utilizado em algumas páginas
        graySoft: "#F5F7FA",     // fundo neutro
        borderSoft: "#E2E8F0",   // borda de componentes
      },
    },
  },  
  plugins: [],
};
