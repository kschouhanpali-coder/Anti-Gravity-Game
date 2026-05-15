import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Squarun",
  assetPrefix: "/Squarun/",
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
