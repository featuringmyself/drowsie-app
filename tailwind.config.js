const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      colors: {
        night: '#130414',
        nightSoft: "#1f0820",
        star: "#fff",
        gray: "#827a87",
      }
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      // RN + expo-font: each Poppins file is a separate family name. Map Tailwind font-weight
      // utilities to the matching loaded face so font-medium, font-bold, etc. work.
      addUtilities({
        ".font-thin": {
          fontFamily: "Poppins_100Thin",
        },
        ".font-extralight": {
          fontFamily: "Poppins_200ExtraLight",
        },
        ".font-light": {
          fontFamily: "Poppins_300Light",
        },
        ".font-normal": {
          fontFamily: "Poppins",
        },
        ".font-medium": {
          fontFamily: "Poppins_500Medium",
        },
        ".font-semibold": {
          fontFamily: "Poppins_600SemiBold",
        },
        ".font-bold": {
          fontFamily: "Poppins_700Bold",
        },
        ".font-extrabold": {
          fontFamily: "Poppins_800ExtraBold",
        },
        ".font-black": {
          fontFamily: "Poppins_900Black",
        },
      });
    }),
  ],
};