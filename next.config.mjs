/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        swcPlugins: [
            [
                "@preact-signals/safe-react/swc",
                {
                    mode: "auto",
                },
            ],
        ],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'arweave.net',
            },
        ],
    },
};

export default nextConfig;
