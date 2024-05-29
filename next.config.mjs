/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Specify the protocol
        hostname: "static.wikia.nocookie.net", // Specify the hostname
        // Optionally, you can also specify the pathname prefix if needed:
        // pathname: '/your/pathname/prefix/*',
      },
      {
        protocol: "https", // Specify the protocol
        hostname: "firebasestorage.googleapis.com", // Specify the hostname
        // Optionally, you can also specify the pathname prefix if needed:
        // pathname: '/your/pathname/prefix/*',
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
    ],
  },
  eslint: {
    dirs: ["."],
  },
};

export default nextConfig;
