import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sokastore.up.railway.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sokastore.com',
        pathname: '/**',
      },
    ],
    // Allow localhost images in development
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Other Next.js config options...
};

export default nextConfig;
