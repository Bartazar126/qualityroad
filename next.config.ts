import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    quality: 70,
    minimumCacheTTL: 60 * 60 * 24 * 90, // 90 days
    deviceSizes: [640, 828, 1080, 1280, 1920],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
