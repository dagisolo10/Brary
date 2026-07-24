export function formatDate(date: Date, time?: boolean) {
    const timeZone = typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone, ...(time && { hour: "numeric", minute: "numeric" }) });
}

export function formatTime(date: Date) {
    const timeZone = typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";
    return date.toLocaleString("en-US", { timeZone, hour: "numeric", minute: "numeric" });
}

export function calculateDuration(startedAt: Date, endsAt: Date | null) {
    if (!endsAt) return null;

    const ms = endsAt.getTime() - startedAt.getTime();
    return formatSessionDuration(ms);
}

export function formatSessionDuration(ms: number): string {
    if (ms <= 0) return "0s";

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    const parts: string[] = [];

    if (hours > 0) parts.push(`${hours}h`);
    if (remainingMinutes > 0) parts.push(`${remainingMinutes}m`);
    if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`);

    return parts.join(" ") || "0s";
}

export function getTotalTime(sessions: { id: string; endsAt: Date | null; startedAt: Date }[]) {
    let totalTimeMs = 0;

    for (const { endsAt, startedAt } of sessions) {
        if (endsAt) {
            totalTimeMs += endsAt.getTime() - startedAt.getTime();
        }
    }

    return totalTimeMs;
}
