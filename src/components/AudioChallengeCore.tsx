import WavesurferPlayer from "@wavesurfer/react";
import type WaveSurfer from "wavesurfer.js";
import {
    useRef,
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import { useTranslations } from "next-intl";

interface AudioChallengeCoreProps {
    audioUrl: string;
    onGuess: (guess: string) => void;
    isDisabled?: boolean;
    feedback?: string | null;
    onFirstPlay?: () => void;
    resetOnNewAudio?: boolean;
    gameState?: "playing" | "gameover";
    onRestart?: () => void;
}

const AudioChallengeCore = forwardRef<
    { playAudio: () => void },
    AudioChallengeCoreProps
>(
    (
        {
            audioUrl,
            onGuess,
            isDisabled,
            feedback,
            onFirstPlay,
            resetOnNewAudio = false,
            gameState = "playing",
            onRestart,
        },
        ref
    ) => {
        const [isPlaying, setIsPlaying] = useState(false);
        const [hasPlayed, setHasPlayed] = useState(false);
        const [isReady, setIsReady] = useState(false);
        const wavesurferRef = useRef<WaveSurfer | null>(null);
        const t = useTranslations("AudioChallenge");

        // Expose playAudio method to parent
        useImperativeHandle(ref, () => ({
            playAudio: () => {
                if (wavesurferRef.current && isReady) {
                    wavesurferRef.current.setTime(0);
                    wavesurferRef.current.play();
                    setIsPlaying(true);

                    if (!hasPlayed) {
                        setHasPlayed(true);
                        if (onFirstPlay) onFirstPlay();
                    }
                } else {
                    console.log("Audio not ready yet, will retry");
                    // Retry after a delay if audio isn't ready
                    setTimeout(() => {
                        if (wavesurferRef.current && isReady) {
                            wavesurferRef.current.setTime(0);
                            wavesurferRef.current.play();
                            setIsPlaying(true);

                            if (!hasPlayed) {
                                setHasPlayed(true);
                                if (onFirstPlay) onFirstPlay();
                            }
                        }
                    }, 500);
                }
            },
        }));

        // Reset audio when URL changes
        useEffect(() => {
            setIsReady(false); // Mark as not ready when URL changes

            if (resetOnNewAudio && wavesurferRef.current) {
                wavesurferRef.current.setTime(0);
                setIsPlaying(false);
            }
        }, [audioUrl, resetOnNewAudio]);

        const handlePlayPause = () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.playPause();
                if (!isPlaying && !hasPlayed) {
                    setHasPlayed(true);
                    if (onFirstPlay) {
                        onFirstPlay();
                    }
                }
                setIsPlaying(!isPlaying);
            }
        };

        // If game is over, show the game over state
        if (gameState === "gameover") {
            return (
                <div className="flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold text-red-600 mt-8 text-center">
                        {t("gameOver")}
                    </div>
                    {onRestart && (
                        <button
                            className="mt-8 px-8 py-3 btn-primary transition-colors font-bold text-lg"
                            onClick={onRestart}
                        >
                            {t("restart")}
                        </button>
                    )}
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center">
                <div className="w-full flex flex-col items-center">
                    <WavesurferPlayer
                        url={audioUrl}
                        width={600}
                        height={60}
                        barWidth={2}
                        barHeight={10}
                        onReady={(ws) => {
                            wavesurferRef.current = ws;
                            setIsReady(true); // Mark as ready when WaveSurfer is ready
                        }}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                    <button
                        className="mt-4 mb-2 px-6 py-2 rounded-full bg-[#7b2458] text-white hover:bg-[#8f2b67] transition-colors"
                        onClick={handlePlayPause}
                        type="button"
                    >
                        {isPlaying ? t("pause") : t("play")}
                    </button>
                </div>

                {/* Fixed-height container to prevent layout shift */}
                <div className="min-h-[120px] flex flex-col items-center justify-center">
                    {/* Conditional rendering of buttons vs feedback */}
                    {!feedback ? (
                        <div className="flex justify-center gap-4 mt-6">
                            <button
                                className="btn-primary py-2 px-4"
                                onClick={() => onGuess("Brandenburg")}
                                disabled={isDisabled}
                            >
                                Brandenburg
                            </button>
                            <button
                                className="btn-primary py-2 px-4"
                                onClick={() => onGuess("Mataro")}
                                disabled={isDisabled}
                            >
                                Mataro
                            </button>
                        </div>
                    ) : (
                        <div className="mt-6 flex flex-col items-center">
                            <span className="font-bold text-lg">
                                {feedback}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

AudioChallengeCore.displayName = "AudioChallengeCore";
export default AudioChallengeCore;
