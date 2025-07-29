/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
        fontSize: {
            'xs': '0.875rem',     // 14px
            'sm': '1rem',         // 16px
            'base': '1.125rem',   // 18px
            'lg': '1.875rem',      // 20px
            'xl': '1.5rem',       // 24px
            '2xl': '1.875rem',    // 30px
            '3xl': '2.25rem',     // 36px
            '4xl': '3rem',        // 48px
        },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
        "light",
        "dark",
        "emerald",
        {
        derp: {
            ...require("daisyui/src/theming/themes")["[data-theme=emerald]"],
            "primary": "#FE9C00",
            "primary-focus": "#1B2BD3",
            "primary-content": "#F9EFED",

            "secondary": "#1B2BD3",
            "accent": "#000038",
            "neutral": "#737373",
            "base-100": "#F9EFED",

            // Optional: Add these for a complete theme
            "info": "#1B2BD3",
            "success": "#22c55e",
            "warning": "#FE9C00",
            "error": "#E82600",
        },
    },]
  }
}
