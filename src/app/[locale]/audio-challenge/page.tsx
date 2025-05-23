"use client";
import { useState, useRef, useEffect } from "react";
import GameTimer from "@/components/GameTimer";
import AudioChallengeCore from "@/components/AudioChallengeCore";
import { getRandomLocationWithMedia } from "@/lib/data";
import { useTranslations } from "next-intl";
import "@egjs/react-view360/css/view360.min.css";
import type { EquirectProjection } from "@egjs/react-view360";
import View360 from "@egjs/react-view360";
import confetti from "canvas-confetti";

export default function TimerPage() {
    const t = useTranslations("AudioChallenge");
    const [gameState, setGameState] = useState<"playing" | "gameover">(
        "playing"
    );

    // Add streak state
    const [streak, setStreak] = useState(0);
    const [showStreakAnimation, setShowStreakAnimation] = useState(false);
    const [streakMilestone, setStreakMilestone] = useState(0);

    interface Challenge {
        location: { name: string; region: string };
        mediaItem: { audioUrl: string; videoUrl: string };
    }

    const [currentChallenge, setCurrentChallenge] = useState<Challenge>({
        location: { name: "", region: "" },
        mediaItem: { audioUrl: "", videoUrl: "" },
    });

    const [feedback, setFeedback] = useState<string | null>(null);
    const [started, setStarted] = useState(false);
    const [expiry, setExpiry] = useState<Date | null>(null);
    const [bonus, setBonus] = useState(false);
    const [timerHighlighted, setTimerHighlighted] = useState(false);
    const [timerPaused, setTimerPaused] = useState(false);
    const [projectionReady, setProjectionReady] = useState(false);
    const [projectionError, setProjectionError] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);
    const audioComponentRef = useRef<{ playAudio: () => void } | null>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const videoElementRef = useRef<HTMLVideoElement | null>(null);

    const [projection, setProjection] = useState<EquirectProjection | null>(
        null
    );

    useEffect(() => {
        async function loadInitialChallenge() {
            try {
                const rawChallenge = await getRandomLocationWithMedia();
                setCurrentChallenge({
                    location: {
                        name: rawChallenge.location.name,
                        region: rawChallenge.location.region,
                    },
                    mediaItem: {
                        audioUrl: rawChallenge.mediaItem.audioUrl || "",
                        videoUrl: rawChallenge.mediaItem.videoUrl || "",
                    },
                });
            } catch (error) {
                console.error("Error loading initial challenge:", error);
            }
        }
        loadInitialChallenge();
        return () => {
            if (videoElementRef.current) {
                try {
                    videoElementRef.current.pause();
                    videoElementRef.current.src = "";
                } catch (e) {
                    console.log("Cleanup error:", e);
                }
            }
        };
    }, []);

    useEffect(() => {
        if (typeof window === "undefined" || !showHint) return;
        let isMounted = true;
        setVideoLoading(true);
        const initProjection = async () => {
            try {
                if (isMounted) {
                    setProjectionReady(false);
                    setProjectionError(false);
                }
                const { EquirectProjection } = await import(
                    "@egjs/react-view360"
                );
                if (!isMounted) return;

                const videoPath = currentChallenge.mediaItem.videoUrl || "";
                console.log("Loading video from:", videoPath);

                // Check if it's actually a video file
                const isVideoFile = videoPath.match(/\.(mp4|webm|ogg)(\?|$)/i);
                if (!videoPath || !isVideoFile) {
                    console.error("Not a valid video URL:", videoPath);
                    if (isMounted) {
                        setProjectionError(true);
                        setVideoLoading(false);
                    }
                    return;
                }

                const proj = new EquirectProjection({
                    src: videoPath,
                    video: {
                        autoplay: true,
                        muted: true, // Start muted (browsers often block autoplay with sound)
                        loop: true,
                    },
                });

                console.log("Created projection with source:", videoPath);

                if (isMounted) {
                    setProjection(proj);
                    setProjectionReady(true);
                    setVideoLoading(false);
                }
            } catch (error) {
                console.error("Error initializing projection:", error);
                if (isMounted) {
                    setProjectionError(true);
                    setVideoLoading(false);
                }
            }
        };
        initProjection();
        return () => {
            isMounted = false;
            if (videoElementRef.current) {
                try {
                    videoElementRef.current.pause();
                    videoElementRef.current.src = "";
                    videoElementRef.current.load();
                } catch (e) {
                    console.log("Cleanup error:", e);
                }
            }
        };
    }, [showHint, currentChallenge.mediaItem.videoUrl]);

    useEffect(() => {
        if (!projectionReady || !videoContainerRef.current) return;
        const videoElement = videoContainerRef.current.querySelector("video");
        if (videoElement) {
            videoElementRef.current = videoElement;
        }
    }, [projectionReady]);

    const handleFirstPlay = () => {
        if (!started) {
            const time = new Date();
            time.setSeconds(time.getSeconds() + 120);
            setExpiry(time);
            setStarted(true);
        }
    };

    const handleExpire = () => setGameState("gameover");

    // Confetti function for streak milestones
    const triggerConfetti = (count: number) => {
        // Play the celebration sound
        const celebrationSound = new Audio("/yippee_sound.mp3");
        celebrationSound.volume = 0.5; // Set to 50% volume
        celebrationSound
            .play()
            .catch((error) => console.log("Audio playback failed:", error));

        confetti({
            particleCount: Math.min(150 + count * 10, 300), // More confetti for higher streaks, capped at 300
            spread: 90,
            origin: { y: 0.5, x: 0.5 },
            colors: ["#7b2458", "#ffcc00", "#ff7733", "#33aaff", "#33ff77"],
            disableForReducedMotion: true,
        });

        // For big milestones, add a second confetti burst
        if (count % 10 === 0) {
            setTimeout(() => {
                confetti({
                    particleCount: 200,
                    angle: 60,
                    spread: 75,
                    origin: { x: 0 },
                });
                confetti({
                    particleCount: 200,
                    angle: 120,
                    spread: 75,
                    origin: { x: 1 },
                });
            }, 200);
        }
    };

    // Update handleGuess to track streak
    const handleGuess = (region: string) => {
        if (feedback) return;
        const correct = region === currentChallenge.location.region;
        setFeedback(correct ? t("correct!") : t("wrong!"));
        setTimerPaused(true);

        if (correct) {
            // Increment streak
            const newStreak = streak + 1;
            setStreak(newStreak);

            // Check for streak milestones (5, 10, 15, etc.)
            if (newStreak % 5 === 0) {
                // Set milestone animation
                setStreakMilestone(newStreak);
                setShowStreakAnimation(true);
                // Hide after animation completes
                setTimeout(() => setShowStreakAnimation(false), 3000);
                // Trigger confetti
                triggerConfetti(newStreak);
            }

            // Timer bonus logic remains the same
            if (expiry) {
                const bonusTime = hintUsed ? 10 : 20;
                setBonus(true);
                setTimerHighlighted(true);
                setExpiry((prev) => {
                    if (!prev) return null;
                    const newTime = new Date(prev);
                    newTime.setSeconds(newTime.getSeconds() + bonusTime);
                    return newTime;
                });
                setTimeout(() => setBonus(false), 2000);
                setTimeout(() => setTimerHighlighted(false), 1000);
            }
        } else {
            // Reset streak on wrong answer
            setStreak(0);
        }
    };

    const handleNext = async () => {
        setFeedback(null);
        setTimerPaused(false);
        setShowHint(false);
        setHintUsed(false);
        if (videoElementRef.current) {
            try {
                videoElementRef.current.pause();
                videoElementRef.current.src = "";
            } catch (e) {
                console.log("Video cleanup error:", e);
            }
        }
        setProjection(null);
        setProjectionReady(false);
        setVideoLoading(false);
        try {
            const rawChallenge = await getRandomLocationWithMedia();
            setCurrentChallenge({
                location: {
                    name: rawChallenge.location.name,
                    region: rawChallenge.location.region,
                },
                mediaItem: {
                    audioUrl: rawChallenge.mediaItem.audioUrl || "",
                    videoUrl: rawChallenge.mediaItem.videoUrl || "",
                },
            });
            setTimeout(() => {
                if (audioComponentRef.current?.playAudio) {
                    audioComponentRef.current.playAudio();
                }
            }, 300);
        } catch (error) {
            console.error("Error loading next challenge:", error);
        }
    };

    const handleRestart = async () => {
        setGameState("playing");
        setFeedback(null);
        setStarted(false);
        setExpiry(null);
        setBonus(false);
        setTimerHighlighted(false);
        setTimerPaused(false);
        setShowHint(false);
        setHintUsed(false);
        setStreak(0); // Reset streak

        if (videoElementRef.current) {
            try {
                videoElementRef.current.pause();
                videoElementRef.current.src = "";
            } catch (e) {
                console.log("Video cleanup error:", e);
            }
        }
        setProjection(null);
        setProjectionReady(false);
        setVideoLoading(false);
        try {
            const challenge = await getRandomLocationWithMedia();
            setCurrentChallenge({
                location: {
                    name: challenge.location.name,
                    region: challenge.location.region,
                },
                mediaItem: {
                    audioUrl: challenge.mediaItem.audioUrl || "",
                    videoUrl: challenge.mediaItem.videoUrl || "",
                },
            });
        } catch (error) {
            console.error("Error restarting game:", error);
        }
    };

    const handleShowHint = () => {
        setShowHint(true);
        setHintUsed(true);
        setTimerPaused(true);
    };

    const handleCloseHint = () => {
        setShowHint(false);
        if (!feedback) {
            setTimerPaused(false);
        }
    };

    const handleViewHintAfterFeedback = () => {
        setShowHint(true);
    };

    const hintReducesBonus =
        t("hintReducesBonus") || "Using a hint reduces your bonus time";
    const showHintText = t("showHint") || "Show Hint";
    const viewHintText = t("viewHint") || "View Hint";
    const nextText = t("next") || "Next";
    const loadingVideoText = t("loadingVideo") || "Loading video";
    const couldNotLoadVideoText =
        t("couldNotLoadVideo") || "Could not load video";

    return (
        <div className="relative min-h-screen bg-white">
            {/* Streak milestone animation */}
            {showStreakAnimation && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                    <div className="bg-black bg-opacity-30 text-white text-4xl font-bold rounded-lg px-10 py-6 transform scale-in animate-bounce">
                        {streakMilestone}{" "}
                        {t("streak", { defaultValue: "STREAK" })}! 🔥
                    </div>
                </div>
            )}

            {/* Timer area with streak counter */}
            <div className="w-full flex flex-col items-center z-20 py-4 text-black absolute top-[calc(25vh)]">
                {/* Streak counter above timer */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-full shadow-lg mb-3">
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold">
                            {t("streak", { defaultValue: "STREAK" })}
                        </span>
                        <span className="text-xl font-bold">{streak}</span>
                        {streak > 0 && <span className="text-lg">🔥</span>}
                    </div>
                </div>

                {/* Timer below streak */}
                <div className="relative">
                    {bonus && started && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                            <div className="text-green-500 font-bold text-2xl animate-float-up">
                                +{hintUsed ? "10s" : "20s"}
                            </div>
                        </div>
                    )}
                    <div
                        className={`transition-colors duration-300 rounded-xl p-2 ${
                            timerHighlighted ? "bg-green-100/90" : ""
                        }`}
                    >
                        <GameTimer
                            key={expiry?.getTime() || "static"}
                            expiryTimestamp={
                                expiry || new Date(Date.now() + 120 * 1000)
                            }
                            onExpire={handleExpire}
                            isPaused={!started || timerPaused}
                        />
                    </div>
                </div>
            </div>

            {/* Main game content */}
            <div className="relative flex flex-col items-center justify-center min-h-screen pt-[10vh] text-black z-10">
                <div className="bg-white p-0 w-full max-w-xl mx-auto">
                    <AudioChallengeCore
                        ref={audioComponentRef}
                        audioUrl={currentChallenge.mediaItem.audioUrl}
                        onGuess={handleGuess}
                        isDisabled={!!feedback}
                        feedback={feedback}
                        onFirstPlay={handleFirstPlay}
                        resetOnNewAudio={true}
                        gameState={gameState}
                        onRestart={handleRestart}
                    />

                    <div className="min-h-[120px] flex flex-col items-center justify-center">
                        {gameState === "playing" &&
                            !feedback &&
                            started &&
                            !showHint && (
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={handleShowHint}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full transition-colors"
                                    >
                                        {showHintText} 👁️
                                        <span className="text-xs block mt-1">
                                            {hintReducesBonus}
                                        </span>
                                    </button>
                                </div>
                            )}

                        {gameState === "playing" && feedback && !showHint && (
                            <div className="mt-4 text-center flex justify-center space-x-4">
                                <button
                                    onClick={handleViewHintAfterFeedback}
                                    className="btn-inverted shadow-2xl outline-1 px-4 py-2 transition-colors"
                                >
                                    {viewHintText} 👁️
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="btn-primary shadow-2xl outline-1 rounded-full px-4 py-2 transition-colors"
                                >
                                    {nextText} →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 360 Video Modal */}
            {showHint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-70"
                        onClick={handleCloseHint}
                    ></div>
                    {videoLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <span className="text-white">Loading video…</span>
                        </div>
                    )}
                    <div className="relative z-10 bg-white overflow-hidden w-[90%] h-[90%] max-w-5xl">
                        <h2 className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50 bg-black bg-opacity-50 px-4 py-2 rounded text-white font-bold">
                            {currentChallenge.location.name}
                        </h2>
                        <button
                            onClick={handleCloseHint}
                            className="absolute top-2 right-2 z-50 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-100 transition-colors"
                            aria-label="Close hint"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <div className="w-full h-full" ref={videoContainerRef}>
                            {projectionReady && projection ? (
                                <View360
                                    className="w-full h-full"
                                    projection={projection}
                                    onReady={() => {
                                        setVideoLoading(false);
                                        const videoElement =
                                            videoContainerRef.current?.querySelector(
                                                "video"
                                            );
                                        if (videoElement) {
                                            videoElementRef.current =
                                                videoElement;
                                            // Unmute after user interaction
                                            videoElement.muted = false;
                                        }
                                        console.log(
                                            "Projection ready, video element found:",
                                            !!videoElement
                                        );
                                    }}
                                    onError={(e) => {
                                        console.error("View360 error:", e);
                                        setProjectionError(true);
                                        setVideoLoading(false);
                                    }}
                                />
                            ) : projectionError ? (
                                <div className="flex flex-col items-center justify-center h-full w-full bg-gray-200 text-gray-500">
                                    <p>{couldNotLoadVideoText}</p>
                                    <p className="text-sm mt-2 text-gray-400">
                                        ({currentChallenge.mediaItem.videoUrl})
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-gray-100 h-full w-full flex items-center justify-center">
                                    <div className="animate-pulse">
                                        {loadingVideoText}...
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
