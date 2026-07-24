"use client";

import { formatDate, formatTime } from "@/utils/formatters";
import { useEffect, useState } from "react";

export function LocalTime({ date, showTime, onlyTime }: { date: Date; showTime?: boolean; onlyTime?: true }) {
    const [formatted, setFormatted] = useState<string>("");

    useEffect(() => {
        if (onlyTime) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormatted(formatTime(new Date(date)));
        } else {
            setFormatted(formatDate(new Date(date), showTime));
        }
    }, [date, onlyTime, showTime]);

    if (!formatted) return <span className="animate-pulse">Loading...</span>;

    return <span suppressHydrationWarning>{formatted}</span>;
}
