"use client";
import { Spinner } from "@/components/ui/spinner";

import { endSession, startSession } from "@/server/session";
import { Book, Session } from "@prisma/client";
import { ArrowRight, BookOpen, PlayIcon, SquareIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface ClientProps {
    preparedBook: Book | null;
    activeSession: Session | null;
}

export default function ReadingDashboard({ activeSession, preparedBook }: ClientProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");

    useEffect(() => {
        if (!activeSession) return;

        const interval = setInterval(() => {
            const start = new Date(activeSession.startedAt).getTime();
            const now = new Date().getTime();
            const diff = Math.max(0, now - start);

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const pad = (num: number) => String(num).padStart(2, "0");
            setElapsedTime(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [activeSession]);

    const handleStart = async () => {
        if (!preparedBook) return;

        setLoading(true);
        setError(null);

        try {
            await startSession(preparedBook.id);
            toast.success(`Started session for "${preparedBook.name}"`);
            router.push("/");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to start session";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleEnd = async () => {
        if (!activeSession || !activeSession.bookId) return;

        setLoading(true);
        setError(null);

        try {
            await endSession({ bookId: activeSession.bookId, sessionId: activeSession.id });
            toast.success("Reading session saved!", {
                action: {
                    label: "View Sessions",
                    onClick: () => router.push("/sessions"),
                },
                duration: 5000,
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to end session";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && (
                <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-2 hover:text-rose-200">
                        ✕
                    </button>
                </div>
            )}

            {activeSession ? (
                <div className="relative overflow-hidden rounded-2xl border border-zinc-800 p-8 shadow-2xl transition-all sm:p-10">
                    <div className="pointer-events-none absolute -top-24 -left-24 size-48 rounded-full bg-emerald-500/10 blur-3xl" />

                    <div className="relative flex flex-col items-center gap-8 text-center">
                        <div className="flex flex-col items-center space-y-2">
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                                <span className="relative flex size-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                                </span>
                                Active Session
                            </span>

                            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{activeSession.bookName || "Untitled Book"}</h2>
                        </div>

                        <div className="py-2">
                            <span className="font-mono text-6xl font-bold tracking-widest tabular-nums">{elapsedTime}</span>
                        </div>

                        <Button size={"cta"} className="w-full" disabled={loading} onClick={handleEnd} variant={"destructive"}>
                            {loading ? (
                                <Spinner />
                            ) : (
                                <>
                                    <SquareIcon className="size-5" />
                                    Stop Reading Session
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            ) : preparedBook ? (
                <div className="border-border relative overflow-hidden rounded-2xl border p-8 text-center shadow-xl sm:p-10">
                    <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-zinc-800/10 blur-3xl" />

                    <div className="relative space-y-6">
                        <div className="space-y-2">
                            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Ready to focus?</span>
                            <h2 className="text-2xl font-bold tracking-tight">{preparedBook.name}</h2>
                            <p className="text-muted-foreground mx-auto max-w-sm text-sm">Press start whenever you are settled in and ready to read.</p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button size={"cta"} className="sm:flex-1" disabled={loading} onClick={handleStart}>
                                {loading ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <PlayIcon className="size-5" /> Start Session
                                    </>
                                )}
                            </Button>
                            <Button size={"cta"} variant={"outline"}>
                                <Link href="/">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border-border mx-auto flex flex-col items-center rounded-2xl border p-10 text-center shadow-xl">
                    <div className="bg-background/10 text-muted-foreground mb-6 flex size-14 items-center justify-center rounded-2xl border border-zinc-800">
                        <BookOpen className="size-5" />
                    </div>

                    <h2 className="mb-2 text-xl font-semibold tracking-tight">No active reading session</h2>
                    <p className="text-muted-foreground mb-8 max-w-xs text-sm">Head over to your personal library to pick a book and kick off a new focus session.</p>
                    <Link href="/books">
                        <Button size={"cta"}>
                            Go to Library
                            <ArrowRight />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
