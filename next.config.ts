import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel deployment
  // output: 'standalone', // Commented out for Vercel compatibility
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@auth/prisma-adapter', '@prisma/client']
  },
  
  // Image optimization
  images: {
    domains: ['img.youtube.com', 'yt3.ggpht.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
