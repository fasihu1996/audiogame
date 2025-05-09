"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ReactPlayer from "react-player";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LocationPage() {
    const searchParams = useSearchParams();
    const t = useTranslations("LocationPage");
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);

    // Get location data from URL params
    const locationId = searchParams.get("id");
    const audioUrl = searchParams.get("audio");
    const videoUrl = `/360videos/${locationId}.mp4`; // You'll need to add your videos

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

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Video Player */}
            <div className="relative h-screen">
                <ReactPlayer
                    url={videoUrl}
                    width="100%"
                    height="100%"
                    playing={isPlaying}
                    loop
                    muted // Mute the video, we'll play audio separately
                    config={{
                        file: {
                            attributes: {
                                crossOrigin: "anonymous",
                                controlsList: "nodownload",
                            },
                        },
                    }}
                />

                {/* Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <div className="max-w-3xl mx-auto space-y-4">
                        {/* Hidden audio element */}
                        <audio
                            ref={audioRef}
                            src={audioUrl || ""}
                            onEnded={() => setIsPlaying(false)}
                        />

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handlePlayPause}
                                className="btn-primary px-6 py-2 rounded-lg transition-colors"
                            >
                                {isPlaying ? t("pause") : t("play")}
                            </button>

                            <div className="flex-1 flex items-center gap-4">
                                <label className="text-sm font-medium">
                                    {t("volume")}:
                                </label>
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="flex-1 accent-[#7b2458]"
                                />
                            </div>

                            <Link
                                href="/map"
                                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                {t("backToMap")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
