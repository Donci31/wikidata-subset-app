/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ["@duckdb/node-api"],
    },
    output: "standalone"
};

export default nextConfig;
