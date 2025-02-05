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
            "primary": "#d04b3d",
            "primary-focus": "#b83d30",
            "primary-content": "#ffffff",

            "secondary": "#ede333",
            "accent": "#8b5cf6",
            "neutral": "#737373",
            "base-100": "#f8fafc",

            // Optional: Add these for a complete theme
            "info": "#0ea5e9",
            "success": "#22c55e",
            "warning": "#f59e0b",
            "error": "#ef4444",
        },
    },]
  }
}
