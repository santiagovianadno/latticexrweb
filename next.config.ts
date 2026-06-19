import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-eu-west-1.amazonaws.com",
        pathname: "/images.playcanvas.com/splat/**",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    formats: ["image/webp"],
  },
};

export default nextConfig;
