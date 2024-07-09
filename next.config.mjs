/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, options) => {
        config.module.rules.push({
          test: /\.node/,
          use: 'node-loader'
        })
     
        return config
    },
};

export default nextConfig;
