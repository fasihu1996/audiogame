import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    i18n: {
        locales: ["es-ES", "de-DE", "en-US"],
        defaultLocale: "en-US",
    },
};

export default nextConfig;
