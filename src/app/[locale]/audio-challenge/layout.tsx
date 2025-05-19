"use client";

import dynamic from "next/dynamic";
import { BRANDENBURG_COORDS, MATARO_COORDS } from "@/lib/coords";
import Link from "next/link";
import { useTranslations } from "next-intl";

const FlatMap = dynamic(() => import("@/components/FlatMap"), { ssr: false });

export default function AudioChallengeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const t = useTranslations("MapPage");
    return (
        <>
            <div className="absolute top-4 w-100 px-4 flex justify-between z-30">
                {/* Home button */}
                <Link
                    href="/"
                    className="btn-inverted py-2 px-4  shadow-md font-sans"
                >
                    ← {t("backToHome")}
                </Link>
            </div>
            <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-white">
                {/* Left circle map (Brandenburg) */}
                <div className="absolute map-circle-left pointer-events-none">
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
                <div className="absolute map-circle-right cursor-pointer pointer-events-none">
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
                {/* Main content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                    {children}
                </div>
            </div>
        </>
    );
}
