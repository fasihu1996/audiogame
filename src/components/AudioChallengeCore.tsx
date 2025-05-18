import WavesurferPlayer from "@wavesurfer/react";
import { useRef, useState } from "react";

interface AudioChallengeCoreProps {
    audioUrl: string;
    onGuess: (guess: string) => void;
    isDisabled?: boolean;
    feedback?: string | null;
    onNext?: () => void;
}

export default function AudioChallengeCore({
    audioUrl,
    onGuess,
    isDisabled,
    feedback,
    onNext,
}: AudioChallengeCoreProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const wavesurferRef = useRef<{ playPause: () => void } | null>(null);

    const handlePlayPause = () => {
        if (wavesurferRef.current) {
            wavesurferRef.current.playPause();
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
                    onReady={(ws) => (wavesurferRef.current = ws)}
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
