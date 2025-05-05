// filepath: src/components/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const languages = [
    { code: "en", src: "/flags/en.svg", alt: "English" },
    { code: "de", src: "/flags/de.svg", alt: "Deutsch" },
    { code: "es", src: "/flags/es.svg", alt: "Español" },
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
        <div className="fixed bottom-2 right-2 z-50 flex gap-1 bg-white/90 rounded-full px-4 py-1 shadow-lg">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => handleSwitch(lang.code)}
                    className="w-6 h-6 rounded-full hover:scale-125 transition flex items-center justify-center"
                    aria-label={`Switch to ${lang.alt}`}
                >
                    <Image
                        src={lang.src}
                        alt={lang.alt}
                        className="w-8 h-8 object-contain"
                        width={36}
                        height={36}
                    />
                </button>
            ))}
        </div>
    );
}
