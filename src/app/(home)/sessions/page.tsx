import { LocalTime } from "@/components/local-time";
import { HourglassIcon } from "@/components/ui/hourglass";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSessions } from "@/server/session";
import { calculateDuration } from "@/utils/formatters";
import { BookOpen, Calendar, Clock, Inbox } from "lucide-react";

export default async function SessionsPage() {
    const sessions = await getSessions();

    return (
        <div className="flex min-h-screen w-full flex-col gap-6">
            <div className="flex flex-col gap-1">
                <span className="text-primary font-mono text-[10px] tracking-widest uppercase">Console / Tracking</span>
                <h1 className="text-3xl font-extrabold tracking-tight">Reading Sessions</h1>
                <p className="text-muted-foreground text-sm">Review your history, active timers, and engagement stats.</p>
            </div>

            {sessions.length === 0 ? (
                <div className="border-border bg-card flex flex-1 flex-col items-center justify-center rounded-2xl border p-16 text-center">
                    <div className="border-border bg-foreground/5 text-muted-foreground mb-4 flex size-12 items-center justify-center rounded-xl border">
                        <Inbox className="size-5" />
                    </div>
                    <h3 className="text-sm font-semibold">No sessions recorded</h3>
                    <p className="text-muted-foreground mt-1 max-w-xs text-xs">Start reading a book to log your very first activity metrics here.</p>
                </div>
            ) : (
                <div className="border-border flex-1 overflow-hidden rounded-2xl border">
                    <div className="overflow-x-auto">
                        <Table className="w-full border-collapse text-left text-sm">
                            <TableHeader>
                                <TableRow className="border-border bg-foreground/2 text-muted-foreground border-b text-xs font-semibold uppercase">
                                    <TableHead className="px-6 py-4">Book Name</TableHead>
                                    <TableHead className="px-6 py-4">Date</TableHead>
                                    <TableHead className="px-6 py-4">Status</TableHead>
                                    <TableHead className="px-6 py-4">Duration</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-border/50 divide-y">
                                {sessions.map((session) => {
                                    const isActive = !session.endsAt;
                                    const isBookDeleted = !session.bookId;
                                    const duration = calculateDuration(session.startedAt, session.endsAt);

                                    return (
                                        <TableRow key={session.id}>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="border-primary/20 bg-primary/5 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg border">
                                                        <BookOpen className="size-4" />
                                                    </div>

                                                    <span className="max-w-50 truncate md:max-w-75">{session.bookName}</span>

                                                    {isBookDeleted && (
                                                        <span className="bg-destructive/10 text-destructive inline-flex max-w-fit items-center rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase">
                                                            Deleted
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-muted-foreground px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <Calendar className="size-3.5" />
                                                    <LocalTime date={session.startedAt} showTime />
                                                </div>
                                            </TableCell>

                                            <TableCell className="px-6 py-4">
                                                {isActive ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                                                        <span className="size-1.5 animate-pulse rounded-full bg-amber-400" />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                                                        <span className="size-1.5 rounded-full bg-emerald-500" />
                                                        Completed
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell className="px-6 py-4">
                                                {isActive ? (
                                                    <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                                                        <HourglassIcon isAnimating size={14} className="fill-amber-400 text-amber-400" />
                                                        Timing...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 font-mono text-xs font-semibold">
                                                        <Clock className="text-muted-foreground size-3.5" />
                                                        {duration}
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    );
}
