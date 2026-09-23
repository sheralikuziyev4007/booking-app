/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#15201A",
        surface: "#1D2A22",
        surface2: "#25342A",
        edge: "#33463A",
        gold: "#C9A227",
        goldDim: "#8C7628",
        ink: "#F1ECDA",
        muted: "#93A296",
        danger: "#D06B52",
        dangerBg: "#3A2620",
        success: "#7FAE7C",
        successBg: "#1F2E22",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
