/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false,
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        108: "27rem",
        195: "48.75rem",
      },
      minWidth: {
        192: "48rem",
      },
    },
  },
  important: "#root",
  plugins: [],
};
