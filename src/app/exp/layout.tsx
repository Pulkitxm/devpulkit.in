import assets from "@/data/assets";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience - Pulkit",
  description: "Discover Pulkit's professional journey, roles, achievements, and the skills honed along the way.",
  openGraph: {
    title: "Experience - Pulkit",
    description:
      "Explore Pulkit's career highlights, including roles, projects, and key contributions in the tech industry.",
    url: "https://devpulkit.in/experience",
    type: "website",
    images: [
      {
        url: assets.banner.experience,
        width: 1200,
        height: 630,
        alt: "Pulkit's Professional Experience"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience - Pulkit",
    description: "Check out Pulkit's professional journey and career milestones in the tech industry.",
    images: [assets.banner.experience]
  }
};

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
