import { useEffect, useState } from "react";
import Card from "../Common/Card";
import Button from "../Common/Button";

export default function TimerPanel({ role, timer, onStart, onPause, onResume, onExtend, onStop, inline = false }) {
    const [displaySeconds, setDisplaySeconds] = useState(null);

    useEffect(() => {
        if (!timer?.startedAt) {
            setDisplaySeconds(timer?.durationSeconds ?? null);
            return;
        }
        if (timer.paused) {
            setDisplaySeconds(Math.round(timer.pausedRemaining));
            return;
        }
        const interval = setInterval(() => {
            const elapsed = (Date.now() - timer.startedAt) / 1000;
            const remaining = Math.max(0, timer.durationSeconds - elapsed);
            setDisplaySeconds(Math.round(remaining));
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    function formatTime(totalSeconds) {
        if (totalSeconds == null) return "--:--";
        const m = Math.floor(totalSeconds / 60);
        const s = Math.floor(totalSeconds % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    }

    const isRunning = timer?.startedAt && !timer?.paused;
    const isLow = displaySeconds != null && displaySeconds <= 60;

    const controls = (
        <div className="flex items-center gap-2">
            <span className={`font-mono font-bold ${inline ? "text-lg" : "text-3xl mb-4"} ${isLow ? "text-red-400" : "text-white"}`}>
                {formatTime(displaySeconds)}
            </span>

            {role === "interviewer" && (
                <div className={`flex ${inline ? "flex-row gap-2 items-center" : "flex-col gap-2"}`}>
                    {!timer?.startedAt && (
                        <div className="flex gap-2">
                            {[30, 45, 60].map((min) => (
                                <button
                                    key={min}
                                    onClick={() => onStart(min * 60)}
                                    className="text-xs px-3 py-1 rounded-lg border border-border hover:border-interviewer text-dim hover:text-white transition-colors"
                                >
                                    {min} min
                                </button>
                            ))}
                        </div>
                    )}
                    {timer?.startedAt && !timer.paused && (
                        <button onClick={onPause} className="text-xs px-2 py-1 rounded border border-border text-dim hover:text-white">Pause</button>
                    )}
                    {timer?.paused && (
                        <button onClick={onResume} className="text-xs px-2 py-1 rounded border border-border text-dim hover:text-white">Resume</button>
                    )}
                    {timer?.startedAt && (
                        <>
                            <button onClick={() => onExtend(5 * 60)} className="text-xs px-2 py-1 rounded border border-border text-dim hover:text-white">+5 min</button>
                            <button onClick={onStop} className="text-xs px-2 py-1 rounded border border-border text-dim hover:text-white">Stop</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );

    if (inline) return controls;

    return (
        <Card className="p-6">
            <h3 className="font-mono text-xs text-dim tracking-wide mb-4">TIMER</h3>
            {controls}
        </Card>
    );
}