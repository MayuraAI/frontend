const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})

module.exports = withBundleAnalyzer(
  withPWA({
    reactStrictMode: true,
    output: 'standalone',
    skipTrailingSlashRedirect: true,
    async rewrites() {
      return [
        {
          source: "/resqW/:path*",
          destination: "https://us.i.posthog.com/:path*",
        },
      ];
    },
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost"
        },
        {
          protocol: "http",
          hostname: "127.0.0.1"
        },
        {
          protocol: "https",
          hostname: "**"
        }
      ]
    },
    experimental: {
      serverComponentsExternalPackages: ["sharp", "onnxruntime-node"]
    },
    webpack: (config, { isServer }) => {
      // Handle CommonJS modules
      config.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      })

      return config
    }
  })
)
