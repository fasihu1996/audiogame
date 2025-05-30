"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

const languages = [
    { code: "en", src: "/flags/en-round.svg", alt: "English" },
    { code: "de", src: "/flags/de-round.svg", alt: "Deutsch" },
    { code: "es", src: "/flags/es-round.svg", alt: "Español" },
    { code: "ct", src: "/flags/ct-round.svg", alt: "Catalan" },
];

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();

    const handleSwitch = (locale: string) => {
        const segments = pathname.split("/");
        if (languages.some((l) => l.code === segments[1])) {
            segments[1] = locale;
        } else {
            segments.splice(1, 0, locale);
        }
        router.push(segments.join("/"));
    };

    return (
        <div className="fixed bottom-2 right-2 z-50 flex gap-1">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => handleSwitch(lang.code)}
                    className="w-9 h-9 rounded-full hover:scale-120 transition flex items-center justify-center"
                    aria-label={`Switch to ${lang.alt}`}
                >
                    <Image
                        src={lang.src}
                        alt={lang.alt}
                        className="object-cover rounded-full aspect-square"
                        width={36}
                        height={36}
                    />
                </button>
            ))}
        </div>
    );
}
