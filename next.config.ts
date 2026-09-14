import type { NextConfig } from "next";

// SITE_BASE_PATH lets the static GitHub Pages snapshot live under a sub-folder
// (e.g. "/oka"). It is unset for the normal hosted build.
const nextConfig: NextConfig = {
  basePath: process.env.SITE_BASE_PATH || undefined,
};

export default nextConfig;
