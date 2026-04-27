import type { MetadataRoute } from "next";
import { ALL_ROOMS } from "@/features/random-chat/constants";

const siteUrl = "https://chat-random-pro.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/rooms`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const roomPages: MetadataRoute.Sitemap = ALL_ROOMS.map((room) => ({
    url: `${siteUrl}/rooms/${room.id}`,
    lastModified: now,
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  return [...staticPages, ...roomPages];
}
