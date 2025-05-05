"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

// Import map component dynamically (no SSR)
const MapCircles = dynamic(() => import("@/components/MapCircles"), {
    ssr: false,
});

export default function LandingPage() {
    const t = useTranslations("HomePage");
    const router = useRouter();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-white">
            {/* Map Circles */}
            <MapCircles />

            {/* Center Content */}
            <div className="z-10 text-center px-4 text-black">
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
