const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})

const withPWA = require("next-pwa")({
  dest: "public"
})

module.exports = withBundleAnalyzer(
  withPWA({
    reactStrictMode: true,
    output: 'standalone',
    // This is required to support PostHog trailing slash API requests
    skipTrailingSlashRedirect: true,
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

      // Handle JSON files
      config.module.rules = config.module.rules.map((rule) => {
        if (rule.test?.test?.('.json')) {
          return {
            ...rule,
            type: 'javascript/auto'
          }
        }
        return rule
      })

      // Optimize chunks
      if (!isServer) {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 70000,
            cacheGroups: {
              default: false,
              vendors: false
            }
          }
        }
      }

      return config
    }
  })
)
