const { fontFamily } = require("tailwindcss/defaultTheme")

// tailwind.config.js
module.exports = {
  content: ["{pages,app}/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-opaque": "rgb(13 42 148 / 18%)",
        gray: {
          0: "#fff",
          100: "#fafafa",
          200: "#eaeaea",
          300: "#999999",
          400: "#888888",
          500: "#666666",
          600: "#444444",
          700: "#333333",
          800: "#222222",
          900: "#111111",
        },
      },
      fontFamily: {
        sans: ["IBM Plex Sans", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
