// @ts-check
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  cacheOnFrontEndNav: true,
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // disable: true,
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  webpack: config => {
    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   o1js: resolve('node_modules/o1js'),
    // };
    // config.experiments = { ...config.experiments, topLevelAwait: true };
    // config.optimization.minimizer = [];
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  reactStrictMode: false,
  images: {
    unoptimized: true
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
  output: 'export',
};

export default withSerwist(nextConfig);
