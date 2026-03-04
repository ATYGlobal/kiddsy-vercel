/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fredoka", "cursive"],
        body: ["Nunito", "sans-serif"],
      },
      colors: {
        kiddsy: {
          blue: "#1565C0",
          "blue-dark": "#0D47A1",
          "blue-light": "#42A5F5",
          gold: "#F9A825",
          "gold-light": "#FFF8E1",
          cream: "#FFFDE7",
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
      },
      boxShadow: {
        magic: "0 20px 60px -10px rgba(21, 101, 192, 0.25)",
        glow: "0 0 40px rgba(249, 168, 37, 0.4)",
        soft: "0 8px 32px rgba(0,0,0,0.08)",
        page: "4px 4px 16px rgba(0,0,0,0.12), -2px -2px 8px rgba(255,255,255,0.8)",
      },
      animation: {
        "float": "float 4s ease-in-out infinite",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
        "page-turn": "pageTurn 0.6s ease-in-out",
        "star-spin": "starSpin 8s linear infinite",
        "bounce-soft": "bounceSoft 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.3)" },
        },
        pageTurn: {
          "0%": { transform: "rotateY(-8deg)", opacity: "0" },
          "100%": { transform: "rotateY(0deg)", opacity: "1" },
        },
        starSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
