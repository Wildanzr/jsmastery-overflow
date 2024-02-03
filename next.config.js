/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["http://localhost:3000"],
      bodySizeLimit: "20mb"
    },
    mdxRs: true,
    serverComponentsExternalPackages: [
      "mongoose",
    ]
  }
}

module.exports = nextConfig
