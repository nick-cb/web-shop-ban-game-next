/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async function () {
    return [
      {
        source: "/",
        destination: "/homepage",
      },
    ];
  },
};

module.exports = nextConfig;
