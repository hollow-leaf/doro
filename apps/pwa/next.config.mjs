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
  reactStrictMode: true,
  output: 'export',
};

export default withSerwist(nextConfig);
