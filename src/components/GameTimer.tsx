import { useEffect } from "react";
import { useTimer } from "react-timer-hook";

interface GameTimerProps {
    expiryTimestamp: Date;
    onExpire?: () => void;
    isPaused?: boolean;
}

export default function GameTimer({
    expiryTimestamp,
    onExpire,
    isPaused = false,
}: GameTimerProps) {
    const { seconds, minutes, isRunning, pause, resume } = useTimer({
        expiryTimestamp,
        onExpire,
        interval: 20,
    });

    useEffect(() => {
        if (isPaused && isRunning) {
            pause();
        } else if (!isPaused && !isRunning) {
            resume();
        }
    }, [isPaused, isRunning, pause, resume]);

    return (
        <div className="text-center">
            <div className="text-5xl">
                <span>{String(minutes).padStart(2, "0")}</span>:
                <span>{String(seconds).padStart(2, "0")}</span>
            </div>
        </div>
    );
}
