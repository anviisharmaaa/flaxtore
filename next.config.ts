import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Local Flaxtore photography (brand/lifestyle/ingredients/nutrition/
     * journal/packaging/products, all under public/images/) needs no
     * remote configuration — this entry exists solely so next/image can
     * safely optimize Shopify-hosted product images once the Storefront
     * API integration lands. Scoped to Shopify's actual CDN host and its
     * file path prefix (not a wildcard host/pathname) so no other remote
     * origin can be requested through this app's image optimizer.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
};

export default nextConfig;
