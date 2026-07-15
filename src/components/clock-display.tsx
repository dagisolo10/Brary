"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function formatDuration(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds].map((n) => n.toString().padStart(2, "0")).join(":");
}

export function ClockDisplay({ startedAt, bookName }: { startedAt: Date | null; bookName: string | null }) {
    const [timer, setTimer] = useState(() => "00:00:00");

    useEffect(() => {
        const tick = () => {
            if (startedAt) setTimer(formatDuration(new Date().getTime() - new Date(startedAt).getTime()));
        };

        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [startedAt]);

    if (startedAt && bookName) {
        return (
            <div className="flex flex-col items-center gap-2">
                <span className="text-muted-foreground text-base">{bookName}</span>
                <span className="text-7xl font-light tracking-tighter tabular-nums sm:text-8xl">{timer}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <span className={cn("animate-pulse text-7xl font-light tracking-tighter tabular-nums opacity-70 sm:text-8xl")}>00:00:00</span>
        </div>
    );
}
