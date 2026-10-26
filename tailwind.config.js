/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0E1813",
        surface: "#15231B",
        surface2: "#1C2F25",
        edge: "#2C4538",
        gold: "#E3AE3C",
        goldDim: "#9A7A2C",
        ink: "#F4EEDB",
        muted: "#9CB0A2",
        danger: "#E5836A",
        dangerBg: "#3A2119",
        success: "#8CC48A",
        successBg: "#1B3022",
        pomegranate: "#B83A52",
        turquoise: "#2F9A98",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        body: ["'Onest Variable'", "system-ui", "sans-serif"],
      },
      keyframes: {
        stepIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "none" },
        },
        ticketIn: {
          "0%": { opacity: "0", transform: "translateY(-20px) rotate(-1.5deg)" },
          "60%": { opacity: "1" },
          "100%": { opacity: "1", transform: "none" },
        },
        drawCheck: {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "step-in": "stepIn .28s ease-out both",
        "ticket-in": "ticketIn .7s cubic-bezier(.2,.8,.2,1) both",
        "draw-check": "drawCheck .5s ease-out .4s both",
      },
    },
  },
  plugins: [],
};
