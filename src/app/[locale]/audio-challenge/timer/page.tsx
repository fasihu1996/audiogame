"use client";
import { useState } from "react";
import GameTimer from "@/components/GameTimer";
import AudioChallengeCore from "@/components/AudioChallengeCore";
import { locationData } from "@/lib/data";
import { useTranslations } from "next-intl";

function getRandomLocation() {
    const idx = Math.floor(Math.random() * locationData.length);
    return locationData[idx];
}

export default function TimerPage() {
    const t = useTranslations("AudioChallenge");
    const [gameState, setGameState] = useState<"playing" | "gameover">(
        "playing"
    );
    const [location, setLocation] = useState(() => getRandomLocation());
    const [feedback, setFeedback] = useState<string | null>(null);

    // Timer setup
    const time = new Date();
    time.setSeconds(time.getSeconds() + 120);

    const handleExpire = () => setGameState("gameover");

    const handleGuess = (region: string) => {
        if (feedback) return;
        setFeedback(region === location.region ? t("correct!") : t("wrong!"));
    };

    const handleNext = () => {
        setLocation(getRandomLocation());
        setFeedback(null);
        setGameState("playing");
    };

    return (
        <div className="relative min-h-screen bg-white">
            {/* Timer at the top */}
            <div className="fixed top-0 left-0 w-full flex justify-center z-20 py-4 text-black">
                <GameTimer expiryTimestamp={time} onExpire={handleExpire} />
            </div>
            <div className="flex flex-col items-center justify-center min-h-screen pt-24 text-black">
                {gameState === "gameover" ? (
                    <div className="text-4xl font-bold text-red-600 mt-8 text-center">
                        Game Over
                        <button
                            className="ml-6 px-4 py-2 rounded bg-blue-600 text-white mt-8"
                            onClick={handleNext}
                        >
                            {t("next")}
                        </button>
                    </div>
                ) : (
                    <AudioChallengeCore
                        audioUrl={location.audioUrl}
                        onGuess={handleGuess}
                        isDisabled={!!feedback}
                        feedback={feedback}
                        onNext={handleNext}
                        // Pass other required props here if needed, e.g. name={location.name} region={location.region}
                    />
                )}
            </div>
        </div>
    );
}
