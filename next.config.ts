import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iqscswudscclvdsiawcc.supabase.co',
      },
    ],
  },
};

export default nextConfig;
