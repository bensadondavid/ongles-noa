import localFont from "next/font/local";

export const blackgold = localFont({
  src: [
    {
      path: "../../fonts/BlackGold_Personal_use.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-blackgold",
  display: "swap",
});

export const moontime = localFont({
  src: [
    {
      path: '../../fonts/MoonTime-Regular.woff2',
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-moontime",
  display: "swap",
});

export const abramo = localFont({
  src: [
    {
      path: '../../fonts/Abramo Script.woff2',
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-abramo",
  display: "swap",
});