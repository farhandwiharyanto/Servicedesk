import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: '/it/tickets',
        destination: '/it/requests',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
