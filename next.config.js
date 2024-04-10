/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    // eslint: {
    //     ignoreDuringBuilds: true,
    // },
    // experimental: {
    //     serverComponents: true,
    // },
    async headers() {
        return [
            {
                source: "/:path*", // Apply HSTS headers to all routes
                headers: [
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "origin-when-cross-origin",
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    i18n: {
        locales: ["en", "es"],
        defaultLocale: "en",
    },
    poweredByHeader: false,
};

module.exports = nextConfig;
