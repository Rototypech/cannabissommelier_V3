import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dev-cannabissomelliersandbox.pantheonsite.io',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
