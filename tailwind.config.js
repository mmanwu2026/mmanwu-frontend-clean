/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // === PLAZA CACHEBUST KEYS ===
      spacing: {
        "__plaza_cachebust_spacing_004": "11px",
      },
      colors: {
        "__plaza_cachebust_color_004": "#fedcba",
      },
      borderRadius: {
        "__plaza_cachebust_radius_004": "5px",
      },
      fontSize: {
        "__plaza_cachebust_font_004": "13px",
      },

      dummy: {},
    },
  },

  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled"],
      backgroundColor: ["disabled"],
    },
  },

  plugins: [
    require("@tailwindcss/forms"),
  ],
};
