const { themeColors } = require("./theme.config");

const tailwindColors = Object.fromEntries(
  Object.entries(themeColors).map(([name, value]) => [
    name,
    {
      DEFAULT: `var(--color-${name})`,
    },
  ]),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan all component and app files for Tailwind classes
  content: ["./app/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}", "./lib/**/*.{js,ts,tsx}", "./hooks/**/*.{js,ts,tsx}"],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: tailwindColors,
    },
  },
  plugins: [],
};
