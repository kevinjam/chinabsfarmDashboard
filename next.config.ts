/** @type {import('next').NextConfig} */
interface WebpackConfig {
  resolve: {
    fallback: {
      [key: string]: boolean | null;
    };
  };
}

interface WebpackOptions {
  isServer: boolean;
}

const nextConfig: {
  webpack: (config: WebpackConfig, options: WebpackOptions) => WebpackConfig;
} = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure 'fs' and other Node.js built-in modules are not bundled on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  
};

module.exports = nextConfig;