import { useState, useRef, useEffect } from "react";

interface AudioPopupProps {
    name: string;
    audioUrl: string;
    onClose: () => void;
}

export function AudioPopup({ name, audioUrl, onClose }: AudioPopupProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    // Stop audio when popup closes
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div className="bg-white rounded-lg p-6 shadow-xl relative z-10 w-96 mx-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 rounded-lg p-1.5"
                        aria-label="Close"
                    >
                        <span className="text-2xl">×</span>
                    </button>
                </div>

                {/* Audio Controls */}
                <div className="space-y-4">
                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        onEnded={() => setIsPlaying(false)}
                    />

                    <button
                        onClick={handlePlayPause}
                        className="w-full py-2.5 px-4 bg-[#7b2458] hover:bg-[#8f2b67] text-white rounded-lg transition-colors"
                    >
                        {isPlaying ? "Pause" : "Play"}
                    </button>

                    {/* Volume Slider */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Volume Control
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-full accent-[#7b2458]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
