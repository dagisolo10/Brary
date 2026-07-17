"use client";

import { formatDate } from "@/utils/formatters";
import { useEffect, useState } from "react";

export function LocalTime({ date, showTime }: { date: Date; showTime?: boolean }) {
    const [formatted, setFormatted] = useState<string>("");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormatted(formatDate(new Date(date), showTime));
    }, [date, showTime]);

    if (!formatted) return <span className="animate-pulse">Loading...</span>;

    return <span suppressHydrationWarning>{formatted}</span>;
}
