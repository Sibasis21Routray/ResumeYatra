// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // enable dark mode using the 'class' strategy
  theme: {
    extend: {
      colors: {
        // Neutral / Backgrounds
        "bg-primary": "#FEFEFE", // Light background
        "bg-secondary": "#F8F8F8", // Light secondary background
        "dark-bg-primary": "#0B1E3B", // Dark background
        "dark-bg-secondary": "#121212", // Dark secondary background

        // Primary / Text
        "text-primary": "#04477E", // Light theme primary text
        "dark-text-primary": "#FEFEFE", // Dark theme primary text

        // Accent / Buttons / Highlights
        accent: "#04477E", // Light theme accent
        "accent-hover": "#5179A6", // Light hover accent
        "dark-accent": "#0366A0", // Dark theme accent
        "dark-accent-hover": "#0366A0", // Dark hover accent

        // Borders
        border: "#E2E2E2", // Light border
        "dark-border": "#1F1F1F", // Dark border

        // Muted Text
        "text-muted": "#666666", // Light muted
        "dark-text-muted": "#CFCFCF", // Dark muted

        // Optional: Shades for hover/focus
        "primary-light": "#5179A6",
        "primary-dark": "#FEFEFE",
        "accent-light": "#5179A6",
        "accent-dark": "#013262",
        "accent-hover": "#5179A6",
        "dark-accent-hover": "#0366A0",
      },
      backgroundImage: {
        "grad-sidebar": "linear-gradient(to bottom, #FEFEFE, #FEFEFE, #D7E4F1)",
        "grad-sidebar-dark":
          "linear-gradient(to left, #0f172a, #1e293b, #334155)",
      },
    },
  },
  plugins: [],
};
