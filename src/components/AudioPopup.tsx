import { useState, useRef, useEffect } from "react";

interface MediaItem {
    id: number;
    audioS3Key: string;
    videoS3Key?: string;
    audioUrl?: string;
    videoUrl?: string;
}

interface AudioPopupProps {
    name: string;
    media: MediaItem[];
    onClose: () => void;
}

export function AudioPopup({ name, media, onClose }: AudioPopupProps) {
    const [isPlaying, setIsPlaying] = useState<number | null>(null);
    const [volume, setVolume] = useState(1);
    const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

    const handlePlayPause = (idx: number) => {
        const audio = audioRefs.current[idx];
        if (!audio) return;

        if (isPlaying === idx) {
            audio.pause();
            setIsPlaying(null);
        } else {
            // Pause any other playing audio
            audioRefs.current.forEach((a, i) => {
                if (a && i !== idx) a.pause();
            });
            audio.play();
            setIsPlaying(idx);
        }
    };

    const handleVolumeChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        idx: number
    ) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        const audio = audioRefs.current[idx];
        if (audio) {
            audio.volume = newVolume;
        }
    };

    // Stop all audio when popup closes
    useEffect(() => {
        const currentAudioRefs = audioRefs.current;
        return () => {
            currentAudioRefs.forEach((audio) => {
                if (audio) audio.pause();
            });
        };
    }, []);

    return (
        <div className="bg-white rounded-lg p-6 shadow-xl relative z-10 w-96 mx-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 rounded-lg p-1.5"
                    aria-label="Close"
                >
                    <span className="text-2xl">×</span>
                </button>
            </div>
            {/* ...rest of popup... */}
            <div className="space-y-6">
                {media.map((item, idx) => (
                    <div key={item.id} className="border-b pb-4">
                        <div className="font-medium text-gray-800 mb-1">
                            Audio {idx + 1}
                        </div>
                        <audio
                            ref={(el) => {
                                audioRefs.current[idx] = el;
                            }}
                            src={item.audioUrl || item.audioS3Key}
                            onEnded={() => setIsPlaying(null)}
                        />
                        <button
                            className="w-full py-2.5 px-4 bg-[#7b2458] hover:bg-[#8f2b67] text-white rounded-lg transition-colors mt-2"
                            onClick={() => handlePlayPause(idx)}
                        >
                            {isPlaying === idx ? "Pause" : "Play"}
                        </button>
                        <div className="space-y-2 mt-2">
                            <label className="text-sm font-medium text-gray-700">
                                Volume Control
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={volume}
                                onChange={(e) => handleVolumeChange(e, idx)}
                                className="w-full accent-[#7b2458]"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
