import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function GameMenu() {
    const t = useTranslations("GameMenu");
    const router = useRouter();

    return (
        <div className="relative z-10 text-center">
            <div className="text-center bg-black/80 backdrop-blur-sm p-12 rounded-2xl">
                <h1 className="text-8xl font-bold mb-12 text-white">
                    {t("chooseMode")}
                </h1>

                <div className="flex flex-col space-y-4">
                    <button
                        onClick={() => router.push("/audio-challenge/lives")}
                        className="w-48 btn-primary py-3 px-8 rounded-md shadow-md transition-colors mx-auto"
                    >
                        {t("lives")}
                    </button>

                    <button
                        onClick={() => router.push("/audio-challenge/rounds")}
                        className="w-48 bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md shadow-md transition-colors mx-auto"
                    >
                        {t("rounds")}
                    </button>

                    <button
                        onClick={() => router.push("/audio-challenge/timer")}
                        className="w-48 bg-green-600 hover:bg-green-700 text-white py-3 px-8 shadow-md transition-colors mx-auto"
                    >
                        {t("timer")}
                    </button>
                </div>
            </div>
        </div>
    );
}
