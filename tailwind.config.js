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
          fontWeight: "100",
        },
        ".font-extralight": {
          fontFamily: "Poppins_200ExtraLight",
          fontWeight: "200",
        },
        ".font-light": {
          fontFamily: "Poppins_300Light",
          fontWeight: "300",
        },
        ".font-normal": {
          fontFamily: "Poppins",
          fontWeight: "400",
        },
        ".font-medium": {
          fontFamily: "Poppins_500Medium",
          fontWeight: "500",
        },
        ".font-semibold": {
          fontFamily: "Poppins_600SemiBold",
          fontWeight: "600",
        },
        ".font-bold": {
          fontFamily: "Poppins_700Bold",
          fontWeight: "700",
        },
        ".font-extrabold": {
          fontFamily: "Poppins_800ExtraBold",
          fontWeight: "800",
        },
        ".font-black": {
          fontFamily: "Poppins_900Black",
          fontWeight: "900",
        },
      });
    }),
  ],
};