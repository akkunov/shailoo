import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bage : '#D9D9D9',
                dark:"#1D1D1D",
            },
        },
        screens: {
            sm: "100%",   // до 640px — 100%
            md:  "720px",
            base: "868px",// до 768px
            lg: "960px",  // до 1024px
            xl:"1140px", // до 1280px
            "2xl": "1320px", // кастомная ширина
        },
    },
    plugins: [],
};
export default config;