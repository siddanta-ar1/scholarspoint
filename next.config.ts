/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Likely needed if you use very broad patterns
    remotePatterns: [
      {
        protocol: 'http', // Include http if you need to support it
        hostname: '**', // THIS ALLOWS *ANY* HOSTNAME. USE WITH EXTREME CAUTION.
        port: '',
        pathname: '**', // THIS ALLOWS *ANY* PATH. USE WITH EXTREME CAUTION.
      },
      {
        protocol: 'https',
        hostname: '**', // THIS ALLOWS *ANY* HOSTNAME. USE WITH EXTREME CAUTION.
        port: '',
        pathname: '**', // THIS ALLOWS *ANY* PATH. USE WITH EXTREME CAUTION.
      },
    ],
  },
  // Other Next.js configurations
};

module.exports = nextConfig;