"use client";
import { useState, useRef, useEffect } from "react";
import GameTimer from "@/components/GameTimer";
import AudioChallengeCore from "@/components/AudioChallengeCore";
import { getRandomLocationWithMedia } from "@/lib/data";
import { useTranslations } from "next-intl";
import "@egjs/react-view360/css/view360.min.css";
import type { EquirectProjection } from "@egjs/react-view360";
import PanoViewer from "@egjs/react-view360";

export default function TimerPage() {
    const t = useTranslations("AudioChallenge");
    const [gameState, setGameState] = useState<"playing" | "gameover">(
        "playing"
    );
    const [loading, setLoading] = useState(true);

    // Define a type for the challenge object
    interface Challenge {
        location: { name: string; region: string };
        mediaItem: { audioUrl: string; videoUrl: string };
    }

    // Use the new data format with an initial empty state
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

    // Initialize projection after component mounts
    const [projection, setProjection] = useState<EquirectProjection | null>(
        null
    ); // Using 'any' to avoid TypeScript errors

    // Load initial challenge
    useEffect(() => {
        let mounted = true;

        async function loadInitialChallenge() {
            setLoading(true);
            try {
                const rawChallenge = await getRandomLocationWithMedia();
                // Map to expected Challenge shape
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
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadInitialChallenge();

        // Cleanup function when component unmounts
        return () => {
            mounted = false;
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

    // This effect initializes the 360 video projection
    useEffect(() => {
        // Only initialize if the hint is shown
        if (typeof window === "undefined" || !showHint) return;

        let isMounted = true; // Flag to prevent state updates after unmount
        setVideoLoading(true);

        const initProjection = async () => {
            try {
                // Reset states when initializing a new projection
                if (isMounted) {
                    setProjectionReady(false);
                    setProjectionError(false);
                }

                // Make sure we have the module loaded
                const { EquirectProjection } = await import(
                    "@egjs/react-view360"
                );

                if (!isMounted) return; // Stop if component unmounted

                // Use the videoUrl from the current challenge's mediaItem
                const videoPath = currentChallenge.mediaItem.videoUrl || "";

                if (!videoPath) {
                    console.error("No video URL available for this location");
                    if (isMounted) {
                        setProjectionError(true);
                        setVideoLoading(false);
                    }
                    return;
                }

                console.log("Initializing projection with video:", videoPath);

                const proj = new EquirectProjection({
                    src: videoPath,
                    video: {
                        autoplay: true,
                        muted: false,
                        loop: true,
                    },
                });

                // Set the projection state
                if (isMounted) {
                    setProjection(proj);
                    setProjectionReady(true);
                    setVideoLoading(false);
                }

                console.log("Projection initialized successfully");
            } catch (error) {
                console.error("Error initializing projection:", error);
                if (isMounted) {
                    setProjectionError(true);
                    setVideoLoading(false);
                }
            }
        };

        initProjection();

        // Cleanup function to prevent memory leaks and state updates after unmount
        return () => {
            isMounted = false;

            // Use the videoElementRef for cleanup instead of projection.getVideo
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

    // Capture video element reference when projection is ready
    useEffect(() => {
        if (!projectionReady || !videoContainerRef.current) return;

        // Find the video element inside the container
        const videoElement = videoContainerRef.current.querySelector("video");
        if (videoElement) {
            videoElementRef.current = videoElement;
        }
    }, [projectionReady]);

    // Handle first play
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
        const correct = region === currentChallenge.location.region;
        setFeedback(correct ? t("correct!") : t("wrong!"));
        setTimerPaused(true);

        if (correct && expiry) {
            // If hint was used, give less bonus time
            const bonusTime = hintUsed ? 10 : 20;

            setBonus(true);
            setTimerHighlighted(true);

            setExpiry((prev) => {
                if (!prev) return null;
                const newTime = new Date(prev);
                newTime.setSeconds(newTime.getSeconds() + bonusTime);
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

    // Update handleNext to be async
    const handleNext = async () => {
        setLoading(true);
        setFeedback(null);
        setTimerPaused(false);
        setShowHint(false);
        setHintUsed(false);

        // Cleanup video
        if (videoElementRef.current) {
            try {
                videoElementRef.current.pause();
                videoElementRef.current.src = "";
            } catch (e) {
                console.log("Video cleanup error:", e);
            }
        }

        // Reset video-related states
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
        } finally {
            setLoading(false);
        }
    };

    // Update handleRestart to be async
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

        // Cleanup video
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
        setLoading(true);

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
        } finally {
            setLoading(false);
        }
    };

    const handleShowHint = () => {
        setShowHint(true);
        setHintUsed(true);
    };

    const handleCloseHint = () => {
        setShowHint(false);
    };

    // Function to handle viewing hint after receiving feedback
    const handleViewHintAfterFeedback = () => {
        setShowHint(true);
        // Don't set hintUsed here since this is after guessing
    };

    // Fallback for missing translation keys
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
            {/* Show loading indicator when loading */}
            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
                    <div className="animate-pulse text-lg">Loading...</div>
                </div>
            )}

            {/* Timer at the top */}
            <div className="w-full flex justify-center z-20 py-4 text-black absolute top-[calc(50vh-180px)]">
                {started && expiry && gameState === "playing" && (
                    <div className="relative">
                        {/* Bonus animation */}
                        {bonus && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                                <div className="text-green-500 font-bold text-2xl animate-float-up">
                                    +{hintUsed ? "10s" : "20s"}
                                </div>
                            </div>
                        )}

                        {/* Timer with highlight effect */}
                        <div
                            className={`transition-colors duration-300 rounded-xl p-2 ${
                                timerHighlighted ? "bg-green-100/90" : ""
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

            {/* Main game content */}
            <div className="relative flex flex-col items-center justify-center min-h-screen pt-24 text-black z-10">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <AudioChallengeCore
                        ref={audioComponentRef}
                        audioUrl={currentChallenge.mediaItem.audioUrl}
                        onGuess={handleGuess}
                        isDisabled={!!feedback || loading}
                        feedback={feedback}
                        onNext={handleNext}
                        onFirstPlay={handleFirstPlay}
                        resetOnNewAudio={true}
                        gameState={gameState}
                        onRestart={handleRestart}
                    />

                    {/* Hint Button - Before feedback */}
                    {gameState === "playing" &&
                        !feedback &&
                        started &&
                        !showHint && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={handleShowHint}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow-md transition-colors"
                                    disabled={loading}
                                >
                                    {showHintText} 👁️
                                    <span className="text-xs block mt-1">
                                        {hintReducesBonus}
                                    </span>
                                </button>
                            </div>
                        )}

                    {/* View Hint Button - After feedback */}
                    {gameState === "playing" && feedback && !showHint && (
                        <div className="mt-4 text-center flex justify-center space-x-4">
                            <button
                                onClick={handleViewHintAfterFeedback}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow-md transition-colors"
                                disabled={loading}
                            >
                                {viewHintText} 👁️
                            </button>
                            <button
                                onClick={handleNext}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow-md transition-colors"
                                disabled={loading}
                            >
                                {nextText} →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 360 Video Modal */}
            {showHint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-70"
                        onClick={handleCloseHint}
                    ></div>
                    {videoLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <span className="text-white">Loading video…</span>
                        </div>
                    )}

                    {/* Modal Content */}
                    <div className="relative z-10 bg-white rounded-lg shadow-xl overflow-hidden w-[90%] h-[90%] max-w-5xl">
                        {/* Location name heading */}
                        <h2 className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50 bg-black bg-opacity-50 px-4 py-2 rounded text-white font-bold">
                            {currentChallenge.location.name}
                        </h2>

                        {/* Close button */}
                        <button
                            onClick={handleCloseHint}
                            className="absolute top-2 right-2 z-50 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-100 transition-colors shadow-md"
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

                        {/* Video Container */}
                        <div className="w-full h-full" ref={videoContainerRef}>
                            {projectionReady && projection ? (
                                <PanoViewer
                                    className="w-full h-full"
                                    projection={projection}
                                    onReady={() => {
                                        setVideoLoading(false);
                                        // Try to find the video element and store it
                                        const videoElement =
                                            videoContainerRef.current?.querySelector(
                                                "video"
                                            );
                                        if (videoElement) {
                                            videoElementRef.current =
                                                videoElement;
                                        }
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
