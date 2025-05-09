"use client";

import FlatMap from "@/components/FlatMap";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

function MapPage() {
    const t = useTranslations("MapPage");
    const searchParams = useSearchParams();

    const mataro = { lat: 41.5381, lon: 2.4445, name: "Mataró" };
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
                zoom={16}
                isFullPage={true}
                currentRegion={city.name}
            />

            {/* Navigation buttons container */}
            <div className="absolute top-4 w-full px-4 flex justify-between z-10">
                {/* Home button */}
                <Link
                    href="/"
                    className="bg-white hover:bg-gray-100 text-[#171717] py-2 px-4 rounded-md shadow-md transition-colors font-sans"
                >
                    ← {t("backToHome")}
                </Link>

                {/* Toggle city button */}
                <button
                    onClick={toggleCity}
                    className="btn-primary py-2 px-4 rounded-md shadow-md transition-colors font-sans"
                >
                    {t("switchTo")}{" "}
                    {city.name === "Brandenburg" ? "Mataró" : "Brandenburg"}
                </button>
            </div>
        </div>
    );
}

export default MapPage;
