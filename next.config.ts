import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
// Accept "repo" or "/repo" via env and normalize
const repoName = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/^\//, "") || "";

const basePath = isProd && repoName ? `/${repoName}` : undefined;
const assetPrefix = basePath ? `${basePath}/` : undefined;

const nextConfig: NextConfig = {
  // Generate a fully static site for GitHub Pages
  output: "export",
  // Ensure nested routes resolve to /path/index.html on static hosts
  trailingSlash: true,
  // Only set in production builds (local dev remains at "/")
  ...(basePath ? { basePath } : {}),
  ...(assetPrefix ? { assetPrefix } : {}),
  // Safety if next/image is ever used; Pages has no image optimizer
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
