import WavesurferPlayer from "@wavesurfer/react";
import type WaveSurfer from "wavesurfer.js";
import {
    useRef,
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";

interface AudioChallengeCoreProps {
    audioUrl: string;
    onGuess: (guess: string) => void;
    isDisabled?: boolean;
    feedback?: string | null;
    onNext?: () => void;
    onFirstPlay?: () => void;
    resetOnNewAudio?: boolean;
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
            onNext,
            onFirstPlay,
            resetOnNewAudio = false,
        },
        ref
    ) => {
        const [isPlaying, setIsPlaying] = useState(false);
        const [hasPlayed, setHasPlayed] = useState(false);
        const wavesurferRef = useRef<WaveSurfer | null>(null);

        // Expose playAudio method to parent
        useImperativeHandle(ref, () => ({
            playAudio: () => {
                if (wavesurferRef.current) {
                    // Reset to beginning
                    wavesurferRef.current.setTime(0);
                    // Start playing
                    wavesurferRef.current.play();
                    setIsPlaying(true);

                    if (!hasPlayed) {
                        setHasPlayed(true);
                        if (onFirstPlay) onFirstPlay();
                    }
                }
            },
        }));

        // Reset audio when URL changes
        useEffect(() => {
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
                        }}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                    <button
                        className="mt-4 mb-2 px-6 py-2 rounded-full bg-[#7b2458] text-white hover:bg-[#8f2b67] transition-colors"
                        onClick={handlePlayPause}
                        type="button"
                    >
                        {isPlaying ? "Pause" : "Play"}
                    </button>
                </div>
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
                {feedback && (
                    <div className="mt-6 flex flex-col items-center">
                        <span className="font-bold text-lg">{feedback}</span>
                        {onNext && (
                            <button
                                className="mt-4 px-6 py-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                                onClick={onNext}
                            >
                                Next
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

AudioChallengeCore.displayName = "AudioChallengeCore";
export default AudioChallengeCore;
