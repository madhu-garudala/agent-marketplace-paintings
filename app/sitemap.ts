import type { MetadataRoute } from "next";
import { paintings } from "@/data/paintings";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://van-gogh-paintings.vercel.app";
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/.well-known/agent.json`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/.well-known/agents.md`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: `${base}/api/paintings`, changeFrequency: "daily", priority: 0.9 },
    ...paintings.map((p) => ({
      url: `${base}/painting/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
