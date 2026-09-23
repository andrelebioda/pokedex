import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.pokelabs.de/sitemap.xml",
    host: "https://www.pokelabs.de",
  };
}
