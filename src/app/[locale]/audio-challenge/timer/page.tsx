"use client";
import { useState, useRef } from "react";
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
    const [started, setStarted] = useState(false);
    const [expiry, setExpiry] = useState<Date | null>(null);
    const [bonus, setBonus] = useState(false);
    const [timerHighlighted, setTimerHighlighted] = useState(false);
    const [timerPaused, setTimerPaused] = useState(false);

    const audioComponentRef = useRef<{ playAudio: () => void } | null>(null);

    const handleFirstPlay = () => {
        if (!started) {
            const time = new Date();
            time.setSeconds(time.getSeconds() + 120);
            setExpiry(time);
            setStarted(true);
        }
    };
    const handleExpire = () => setGameState("gameover");

    const handleGuess = (region: string) => {
        if (feedback) return;
        const correct = region === location.region;
        setFeedback(correct ? t("correct!") : t("wrong!"));
        setTimerPaused(true);

        if (correct && expiry) {
            setBonus(true);
            setTimerHighlighted(true);

            setExpiry((prev) => {
                if (!prev) return null;
                const newTime = new Date(prev);
                newTime.setSeconds(newTime.getSeconds() + 20);
                return newTime;
            });

            setTimeout(() => {
                setBonus(false);
            }, 2000);

            setTimeout(() => {
                setTimerHighlighted(false);
            }, 1000);
        }
    };

    const handleNext = () => {
        setLocation(getRandomLocation());
        setFeedback(null);
        setTimerPaused(false);
        setTimeout(() => {
            if (audioComponentRef.current?.playAudio) {
                audioComponentRef.current.playAudio();
            }
        }, 300);
        setGameState("playing");
    };

    return (
        <div className="relative min-h-screen bg-white">
            {/* Timer at the top */}
            <div className="w-full flex justify-center z-20 py-4 text-black absolute top-[calc(50vh-180px)]">
                {started && expiry && (
                    <div className="relative">
                        {/* Bonus animation */}
                        {bonus && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                                <div className="text-green-500 font-bold text-2xl animate-float-up">
                                    +20s
                                </div>
                            </div>
                        )}

                        {/* Timer with highlight effect */}
                        <div
                            className={`transition-colors duration-300 rounded-xl p-2 ${
                                timerHighlighted ? "bg-green-100" : ""
                            }`}
                        >
                            <GameTimer
                                key={expiry?.getTime()}
                                expiryTimestamp={expiry}
                                onExpire={handleExpire}
                                isPaused={timerPaused}
                            />
                        </div>
                    </div>
                )}
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
                        onFirstPlay={handleFirstPlay}
                        resetOnNewAudio={true}
                        // Pass other required props here if needed, e.g. name={location.name} region={location.region}
                    />
                )}
            </div>
        </div>
    );
}
