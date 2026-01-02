import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ide-indonesia-revamp',  // <--- ADD THIS LINE (matches your repo name)
  images: { unoptimized: true },
};

export default nextConfig;
