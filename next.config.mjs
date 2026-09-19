/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Optimized variants are generated on first request and that first
    // request is the slow one, so keep them for 31 days instead of the
    // 4 hour default and offer fewer widths so more requests hit the cache.
    // 2560 matches the cap scripts/shrink-images.mjs applies to the sources.
    minimumCacheTTL: 2678400,
    deviceSizes: [640, 828, 1200, 1920, 2560],
    imageSizes: [64, 128, 256, 384],
  },
  // Keep every *.vercel.app address (previews and the project's default
  // production alias) out of search engines. Only the real domain, once it
  // is attached, may be indexed.
  // The live site answers on the bare domain and sends www there with a 308.
  // Keep that once skralli.is is attached to this project.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.skralli.is" }],
        destination: "https://skralli.is/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};
export default nextConfig;
