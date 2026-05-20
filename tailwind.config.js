/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Binice brand palette
        ink: "#395970",        // primary dark blue (text, footer)
        "ink-soft": "#7d94a4", // accent blue
        sage: "#d5e3d6",       // light-green hero background
        clay: "#e18d56",       // orange CTA / nav active
        slate: "#8299a7",      // browser bar grey-blue
        muted: "#454545",      // body grey
      },
      fontFamily: {
        display: ["'Poetsen One'", "sans-serif"],
        brand: ["'Chewy'", "cursive"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
