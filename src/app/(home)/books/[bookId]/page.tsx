import { LocalTime } from "@/components/local-time";
import { HourglassIcon } from "@/components/ui/hourglass";
import { cn } from "@/lib/utils";
import { getBook } from "@/server/book";
import { calculateDuration } from "@/utils/formatters";
import { ArrowLeft, BookOpen, Calendar, Clock, History } from "lucide-react";
import Link from "next/link";

export default async function BookDetailPage({ params }: { params: Promise<{ bookId: string }> }) {
    const { bookId } = await params;

    const book = await getBook(bookId);

    return (
        <div className="flex min-h-screen flex-col gap-6">
            <div>
                <Link href="/books" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-xs font-medium transition-colors">
                    <ArrowLeft className="size-3.5" /> Back to Library
                </Link>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <div className="border-primary/20 bg-primary/5 text-primary flex size-14 shrink-0 items-center justify-center rounded-2xl border">
                        <BookOpen className="size-7" />
                    </div>

                    <div className="space-y-2">
                        <span className="text-primary font-mono text-[10px] tracking-widest uppercase">Library / Book Details</span>
                        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{book.name}</h1>
                        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                            <Calendar className="size-3.5" /> Added <LocalTime date={book.createdAt} showTime />
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="border-border bg-card rounded-2xl border p-5">
                    <div className="flex h-full flex-col justify-between gap-3">
                        <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase">
                            <HourglassIcon isAnimating size={16} className="size-3.5" /> Cumulative Focus
                        </span>
                        <div>
                            <div className="text-2xl font-extrabold tracking-tight text-emerald-400">{book.stats.formattedTotalTime}</div>
                            <p className="text-muted-foreground mt-1 text-[11px]">Total computed time reading this book.</p>
                        </div>
                    </div>
                </div>

                <div className="border-border bg-card rounded-2xl border p-5">
                    <div className="flex h-full flex-col justify-between gap-3">
                        <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase">
                            <History className="size-3.5" /> Intervals logged
                        </span>
                        <div>
                            <div className="text-2xl font-extrabold tracking-tight">{book.stats.totalSessions}</div>
                            <p className="text-muted-foreground mt-1 text-[11px]">Distinct sessions committed to database.</p>
                        </div>
                    </div>
                </div>

                <div className="border-border bg-card rounded-2xl border p-5">
                    <div className="flex h-full flex-col justify-between gap-3">
                        <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase">
                            <Clock className="size-3.5" /> Average Session
                        </span>
                        <div>
                            <div className="text-2xl font-extrabold tracking-tight">{book.stats.formattedAverageTime}</div>
                            <p className="text-muted-foreground mt-1 text-[11px]">Average focus block duration.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-border bg-card flex-1 rounded-2xl border p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-0.5">
                        <h2 className="text-lg font-bold tracking-tight">Focus History</h2>
                        <p className="text-muted-foreground text-xs">Chronological timeline of your reading activity for this book.</p>
                    </div>
                </div>

                {book.sessions.length === 0 ? (
                    <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
                        <Clock className="text-muted-foreground mb-3 size-8 opacity-40" />
                        <h4 className="text-sm font-semibold">No Sessions Yet</h4>
                        <p className="text-muted-foreground mt-1 max-w-xs text-xs">Sessions will show up here as soon as you record your first timer.</p>
                    </div>
                ) : (
                    <div className="relative space-y-6 border-l border-zinc-800 pl-6">
                        {book.sessions.map((session) => {
                            const isActive = !session.endsAt;
                            const duration = calculateDuration(session.startedAt, session.endsAt);

                            return (
                                <div key={session.id} className="group relative">
                                    <span
                                        className={cn(
                                            isActive ? "border-amber-500" : "border-zinc-700",
                                            "absolute top-1.5 -left-7.75 flex size-4 items-center justify-center rounded-full border bg-zinc-950 ring-4 ring-zinc-950",
                                        )}
                                    >
                                        {isActive && <span className="size-1.5 animate-pulse rounded-full bg-amber-400" />}
                                    </span>

                                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold">{isActive ? "Currently Reading" : "Completed Session"}</span>
                                                {isActive && (
                                                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">Active Now</span>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground flex items-center gap-1 text-xs">
                                                <Calendar className="size-3" /> <LocalTime date={session.startedAt} showTime />
                                            </p>
                                        </div>

                                        <div className="text-sm">
                                            {isActive ? (
                                                <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                                                    <HourglassIcon size={16} isAnimating className="text-amber-400" /> Timing...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 font-mono text-xs font-semibold">
                                                    <Clock className="text-muted-foreground size-3.5" /> {duration}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
