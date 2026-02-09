/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "ui-sans-serif", "system-ui"],
        display: ["Syne", "Space Grotesk", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: {
          50: "#f5f7fb",
          100: "#e9eef7",
          200: "#cdd9ee",
          300: "#9eb3d9",
          400: "#718cc2",
          500: "#4b69a7",
          600: "#375089",
          700: "#273a66",
          800: "#1a2643",
          900: "#101829"
        }
      },
      boxShadow: {
        glow: "0 0 60px rgba(82, 255, 188, 0.25)",
        glass: "0 20px 60px rgba(15, 23, 42, 0.2)"
      },
      backgroundImage: {
        grid: "linear-gradient(transparent 95%, rgba(255,255,255,0.08) 95%), linear-gradient(90deg, transparent 95%, rgba(255,255,255,0.08) 95%)"
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out both",
        "float-slow": "floatSlow 12s ease-in-out infinite"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        floatSlow: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
          "100%": { transform: "translateY(0px)" }
        }
      }
    }
  },
  plugins: []
};
