"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import dynamic from "next/dynamic";

// Import map component dynamically (no SSR)
const MapCircle = dynamic(() => import("@/components/MapCircle"), {
    ssr: false,
});

export default function LandingPage() {
    const t = useTranslations("HomePage");

    return (
        <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-white">
            {/* Left Map Circle */}
            <div className="map-circle-left absolute left-0 top-1/2 -translate-y-1/2">
                <MapCircle
                    center={{ lat: 52.3906, lng: 13.0645 }}
                    markerLabel="Brandenburg"
                />
            </div>
            {/* Right Map Circle */}
            <div className="map-circle-right absolute right-0 top-1/2 -translate-y-1/2">
                <MapCircle
                    center={{ lat: 41.5296, lng: 2.4445 }}
                    markerLabel="Mataró"
                />
            </div>

            {/* Center Content */}
            <div className="z-10 text-center px-16 md:px-24 lg:px-32 text-black max-w-2xl mx-auto">
                <h1 className="text-6xl font-bold mb-2">
                    AUDIO
                    <br />
                    GUESSER
                </h1>
                <h2 className="text-2xl mb-8">Brandenburg & Mataró</h2>

                <div className="flex justify-center">
                    <Link
                        href="/audio-challenge"
                        className="bg-[#7b2458] hover:bg-[#8f2b67] text-white py-2 px-8 rounded-md transition-colors"
                    >
                        {t("startGame")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
