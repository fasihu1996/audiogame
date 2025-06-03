import { useEffect, useRef } from "react";

interface GameTimerProps {
    seconds: number;
    onExpire?: () => void;
    isPaused?: boolean;
}

export default function GameTimer({
    seconds,
    onExpire,
    isPaused = false,
}: GameTimerProps) {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isPaused || seconds <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (seconds <= 0 && onExpire) onExpire();
            return;
        }
        intervalRef.current = setInterval(() => {
            // The parent should update the seconds value
        }, 1000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPaused, seconds, onExpire]);

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return (
        <div className="text-center">
            <div className="text-5xl">
                <span>{String(mins).padStart(2, "0")}</span>:
                <span>{String(secs).padStart(2, "0")}</span>
            </div>
        </div>
    );
}
