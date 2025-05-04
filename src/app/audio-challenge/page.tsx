"use client";

import React, { useRef, useState, useEffect } from "react";
import { locationData } from "@/lib/data";
import Image from "next/image";

function getRandomLocation() {
    const idx = Math.floor(Math.random() * locationData.length);
    return locationData[idx];
}

export default function AudioChallenge() {
    const [location, setLocation] = useState(() => getRandomLocation());
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [blur, setBlur] = useState(true);
    const [timer, setTimer] = useState(30);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (isPlaying && blur && timer > 0) {
            timerRef.current = setInterval(() => {
                setTimer((t) => t - 1);
            }, 1000);
        } else if (!isPlaying || timer === 0) {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, blur, timer]);

    useEffect(() => {
        if (timer === 0) {
            setBlur(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    }, [timer]);

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
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

    const handleGuess = (region: string) => {
        if (feedback) return;
        setFeedback(region === location.region ? "Correct!" : "Wrong!");
    };

    const handleNext = () => {
        setLocation(getRandomLocation());
        setFeedback(null);
        setIsPlaying(false);
        setBlur(true);
        setTimer(30);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    return (
        <div className="min-h-screen relative bg-[#111]">
            <div
                className="flex items-center justify-center absolute top-0 left-0 w-full"
                style={{
                    height: "calc(100vh - 120px)",
                    zIndex: 1,
                }}
            >
                <Image
                    src={location.imageUrl}
                    alt="Location"
                    width={600}
                    height={400}
                    className="w-[80vw] max-w-[600px] h-[60vh] object-cover rounded-xl shadow-2xl"
                    style={{
                        filter: `blur(${blur ? 20 : 0}px)`,
                        transition: "filter 0.5s",
                        boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
                    }}
                />
            </div>
            {/* Bottom bar */}
            <div className="fixed left-0 bottom-0 w-full bg-[#222] text-white py-6 pb-4 shadow-[0_-2px_16px_rgba(0,0,0,0.3)] z-10">
                <div className="flex flex-col items-center">
                    <audio
                        ref={audioRef}
                        src={location.audioUrl}
                        onEnded={() => setIsPlaying(false)}
                        className="w-full"
                    />
                    <div className="my-2 flex items-center">
                        <button
                            onClick={handlePlayPause}
                            className="mr-2 px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {isPlaying ? "Pause" : "Play"}
                        </button>
                        <label className="ml-2 flex items-center">
                            Volume:
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={volume}
                                onChange={handleVolumeChange}
                                className="ml-1 accent-blue-600"
                            />
                        </label>
                        <span className="ml-4 font-semibold">
                            {blur ? `Hint in: ${timer}s` : "Hint revealed!"}
                        </span>
                    </div>
                    <div className="my-2 flex">
                        <button
                            onClick={() => handleGuess("Brandenburg")}
                            className="mx-4 min-w-[120px] px-4 py-2 rounded bg-green-600 hover:bg-green-700 transition disabled:opacity-50"
                            disabled={!!feedback}
                        >
                            Brandenburg
                        </button>
                        <button
                            onClick={() => handleGuess("Mataro")}
                            className="mx-4 min-w-[120px] px-4 py-2 rounded bg-green-600 hover:bg-green-700 transition disabled:opacity-50"
                            disabled={!!feedback}
                        >
                            Mataro
                        </button>
                    </div>
                    {feedback && (
                        <div className="mt-2 font-bold flex items-center">
                            {feedback}
                            <button
                                onClick={handleNext}
                                className="ml-6 px-4 py-1 rounded bg-yellow-500 hover:bg-yellow-600 transition"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
