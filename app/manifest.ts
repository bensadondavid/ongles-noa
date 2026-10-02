import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/dashboard",
    name: "Noa Bensadon",
    short_name: "Noa",
    description: "Gestion des rendez-vous Noa Bensadon",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#111111",
    theme_color: "#111111",
    icons: [
      { src: "/logo-noa-fav.png", sizes: "64x64", type: "image/png" },
    ],
  };
}
