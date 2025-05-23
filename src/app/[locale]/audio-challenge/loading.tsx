import React from "react";

export default function AudioChallengeLoading() {
    return (
        <div className="relative min-h-screen bg-white flex flex-col items-center justify-center">
            {/* Timer skeleton */}
            <div className="w-full flex justify-center py-4 absolute top-[calc(50vh-240px)] z-20">
                <div className="h-12 w-40 bg-gray-200 rounded-xl animate-pulse" />
            </div>

            {/* Main content skeleton */}
            <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto pt-24">
                {/* Audio waveform skeleton */}
                <div className="w-full flex flex-col items-center">
                    <div className="w-[320px] h-[60px] bg-gray-200 rounded-md animate-pulse mb-6" />
                    {/* Play button skeleton */}
                    <div className="w-24 h-10 bg-gray-200 rounded-full animate-pulse mb-6" />
                </div>
                {/* Guess buttons skeleton */}
                <div className="flex justify-center gap-4 mt-6">
                    <div className="w-32 h-10 bg-gray-200 rounded-full animate-pulse" />
                    <div className="w-32 h-10 bg-gray-200 rounded-full animate-pulse" />
                </div>
                {/* Hint button skeleton */}
                <div className="mt-8 w-40 h-10 bg-gray-200 rounded-full animate-pulse" />
            </div>

            {/* Video hint modal skeleton */}
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="relative bg-white overflow-hidden w-[90%] h-[90%] max-w-5xl flex items-center justify-center rounded-lg shadow-lg">
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="w-[80%] h-[60%] bg-gray-200 rounded-lg animate-pulse" />
                        <div className="mt-4 w-32 h-8 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
