"use client";

import FlatMap from "@/components/FlatMap";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

function MapPage() {
    const t = useTranslations("MapPage");
    const searchParams = useSearchParams();

    const mataro = { lat: 41.555, lon: 2.4445, name: "Mataró" };
    const brandenburg = { lat: 52.4106, lon: 12.5445, name: "Brandenburg" };

    // Initialize city based on URL parameter
    const initialCity =
        searchParams.get("city") === "mataro" ? mataro : brandenburg;
    const [city, setCity] = useState(initialCity);

    const toggleCity = () => {
        setCity(city.name === "Brandenburg" ? mataro : brandenburg);
    };

    return (
        <div className="relative w-full h-screen">
            <FlatMap
                lat={city.lat}
                lon={city.lon}
                zoom={14}
                isFullPage={true}
                currentRegion={city.name}
            />

            {/* Navigation buttons container */}
            <div className="absolute top-4 w-full px-4 flex justify-between z-10">
                {/* Home button */}
                <Link
                    href="/"
                    className="bg-white text-[#c73e90] rounded-full py-2 px-4  shadow-md transition-colors font-sans"
                >
                    ← {t("backToHome")}
                </Link>

                {/* Toggle city button */}
                <button
                    onClick={toggleCity}
                    className="btn-primary py-2 px-4 shadow-md transition-colors font-sans"
                >
                    {t("switchTo")}{" "}
                    {city.name === "Brandenburg" ? "Mataró" : "Brandenburg"}
                </button>
            </div>
        </div>
    );
}

export default MapPage;
