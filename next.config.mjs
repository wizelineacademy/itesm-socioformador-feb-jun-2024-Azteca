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
    ],
  },
  transpilePackages: ["@mui/x-charts"],
};

export default nextConfig;
