import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Fallback initials-avatar for users who haven't uploaded a profile photo.
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },
};

export default nextConfig;
