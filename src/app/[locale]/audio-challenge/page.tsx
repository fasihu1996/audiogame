"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BRANDENBURG_COORDS, MATARO_COORDS } from "@/lib/coords";
import GameMenu from "@/components/GameMenu";

const FlatMap = dynamic(() => import("@/components/FlatMap"), { ssr: false });

export default function LandingPage() {
    const t = useTranslations("HomePage");
    const router = useRouter();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-white">
            {/* Left circle map (Brandenburg) */}
            <div className="absolute map-circle-left">
                <div className="round-container border border-gray-200 shadow-lg">
                    <div className="map-container">
                        <FlatMap
                            lat={BRANDENBURG_COORDS.lat}
                            lon={BRANDENBURG_COORDS.lon}
                            zoom={14}
                            className="w-full h-full"
                            isFullPage={false}
                        />
                    </div>
                </div>
            </div>

            {/* Right circle map (Mataro) */}
            <div className="absolute map-circle-right cursor-pointer">
                <div className="round-container border border-gray-200 shadow-lg">
                    <div className="map-container">
                        <FlatMap
                            lat={MATARO_COORDS.lat}
                            lon={MATARO_COORDS.lon}
                            zoom={14}
                            className="w-full h-full"
                            isFullPage={false}
                        />
                    </div>
                </div>
            </div>

            <GameMenu />
        </div>
    );
}
