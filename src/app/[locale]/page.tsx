"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";

const FlatMap = dynamic(() => import("@/components/FlatMap"), { ssr: false });

export default function LandingPage() {
    const t = useTranslations("HomePage");
    const router = useRouter();

    const brandenburgCoords = { lat: 52.4106, lon: 12.5245 };
    const mataroCoords = { lat: 41.5396, lon: 2.4685 };

    const handleMapClick = (city: string) => {
        router.push(`/map?city=${city.toLowerCase()}`);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-white">
            {/* Left circle map (Brandenburg) */}
            <div
                className="absolute map-circle-left cursor-pointer"
                onClick={() => handleMapClick("brandenburg")}
            >
                <div className="round-container border border-gray-200 shadow-lg">
                    <div className="map-container">
                        <FlatMap
                            lat={brandenburgCoords.lat}
                            lon={brandenburgCoords.lon}
                            zoom={14}
                            className="w-full h-full"
                            isFullPage={false}
                        />
                    </div>
                </div>
            </div>

            {/* Right circle map (Mataro) */}
            <div
                className="absolute map-circle-right cursor-pointer"
                onClick={() => handleMapClick("mataro")}
            >
                <div className="round-container border border-gray-200 shadow-lg">
                    <div className="map-container">
                        <FlatMap
                            lat={mataroCoords.lat}
                            lon={mataroCoords.lon}
                            zoom={14}
                            className="w-full h-full"
                            isFullPage={false}
                        />
                    </div>
                </div>
            </div>

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
