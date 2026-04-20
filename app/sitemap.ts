import type { MetadataRoute } from "next";

const BASE_URL = "https://labor-calc.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/severance",
    "/net-salary",
    "/annual-leave",
    "/insurance",
    "/weekly-holiday",
    "/overtime",
  ];

  return pages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.9,
  }));
}
