"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
    const t = useTranslations("AboutPage");

    return (
        <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-white text-black">
            <div className="max-w-3xl w-full text-center mb-8">
                <h1 className="text-4xl font-bold mb-6">{t("aboutTitle")}</h1>

                <div className="mb-10 text-left">
                    <h2 className="text-2xl font-semibold mb-3">
                        {t("whatIsTitle")}
                    </h2>
                    <p className="mb-4 text-gray-700">
                        {t("whatIsDescription")}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mb-10">
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-3">
                            Brandenburg
                        </h2>
                        <p className="text-gray-700 mb-4">
                            {t("brandenburgDescription")}
                        </p>
                        <div className="rounded-lg overflow-hidden shadow-md">
                            <Image
                                src="/brandenburg_city.jpg"
                                alt="Brandenburg"
                                width={500}
                                height={300}
                                className="object-cover w-full h-48"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-3">Mataró</h2>
                        <p className="text-gray-700 mb-4">
                            {t("mataroDescription")}
                        </p>
                        <div className="rounded-lg overflow-hidden shadow-md">
                            <Image
                                src="/mataro_beach.jpg"
                                alt="Mataró"
                                width={500}
                                height={300}
                                className="object-cover w-full h-48"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Link
                        href="/"
                        className="inline-block bg-[#7b2458] hover:bg-[#8f2b67] text-white py-2 px-8 rounded-md transition-colors"
                    >
                        {t("backToHome")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
