import { useTimer } from "react-timer-hook";

interface GameTimerProps {
    expiryTimestamp: Date;
    onExpire?: () => void;
}

export default function GameTimer({
    expiryTimestamp,
    onExpire,
}: GameTimerProps) {
    const { seconds, minutes } = useTimer({
        expiryTimestamp,
        onExpire,
        interval: 20,
    });

    return (
        <div className="text-center">
            <div className="text-4xl">
                <span>{String(minutes).padStart(2, "0")}</span>:
                <span>{String(seconds).padStart(2, "0")}</span>
            </div>
        </div>
    );
}
