import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',               // <--- This line is critical!
  images: { unoptimized: true },  // <--- Required for images on GitHub Pages
};

export default nextConfig;
