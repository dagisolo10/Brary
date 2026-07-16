import { Session } from "@prisma/client";

export function formatDuration(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }

    return `${seconds}s`;
}

export function formatDateTime(date: Date) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" });
}

export function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function sessionLabel(session: Session) {
    const started = new Date(session.startedAt);

    if (session.endsAt) {
        const ended = new Date(session.endsAt);
        const duration = ended.getTime() - started.getTime();

        return `${formatDuration(duration)} \u00B7 ${formatDateTime(started)}`;
    }

    return `Active \u00B7 Started ${formatTime(started)}`;
}
