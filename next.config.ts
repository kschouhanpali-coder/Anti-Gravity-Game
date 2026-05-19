import type { NextConfig } from "next";


const isGithubActions = process.env.GITHUB_ACTIONS || false;

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubActions ? "/Squarun" : "",
  assetPrefix: isGithubActions ? "/Squarun/" : "",
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
