"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import MapCircles with SSR disabled
const MapCircles = dynamic(
    () => import("@/components/MapCircle").then((mod) => mod.MapCircles),
    { ssr: false }
);

export default function LandingPage() {
    const t = useTranslations("HomePage");

    return (
        <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-white">
            <MapCircles />

            {/* Center Content */}
            <div className="z-10 text-center px-16 md:px-24 lg:px-32 text-black max-w-2xl mx-auto">
                <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-[#c73e90] to-red-600 text-transparent bg-clip-text">
                    AUDIO
                    <br />
                    GUESSER
                </h1>
                <h2 className="text-2xl mb-8">Brandenburg & Mataró</h2>

                <div className="flex justify-center">
                    <Link
                        href="/audio-challenge"
                        className="bg-[#c73e90] hover:bg-[#a23074] text-white py-2 px-8 rounded-md transition-colors"
                    >
                        {t("startGame")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
