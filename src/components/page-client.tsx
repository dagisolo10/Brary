"use client";

import { createSession, endSession, getSessionsWithBooks } from "@/server/session";
import { toast } from "sonner";
import { useState } from "react";
import { ClockDisplay } from "./clock-display";
import { Sidebar } from "./sidebar";
import { StartButton } from "./start-button";

type Book = { id: string; name: string };
type ActiveSession = { id: string; bookId: string; startedAt: Date; book: { id: string; name: string } } | null;
type Session = Awaited<ReturnType<typeof getSessionsWithBooks>>[number];

export function PageClient({ books, activeSession, sessions }: { books: Book[]; activeSession: ActiveSession; sessions: Session[] }) {
    const [pending, setPending] = useState(false);

    const [selectedBookId, setSelectedBookId] = useState<string | null>(activeSession ? activeSession.bookId : null);

    const [session, setSession] = useState<ActiveSession>(activeSession);

    const canStart = selectedBookId !== null && !session;

    async function startTimer() {
        if (!selectedBookId || pending) return;

        setPending(true);

        try {
            const newSession = await createSession(selectedBookId);

            const bookName = books.find((b) => b.id === newSession.bookId)!.name;
            setSession({
                id: newSession.id,
                bookId: newSession.bookId,
                startedAt: newSession.startedAt,
                book: { id: newSession.bookId, name: bookName },
            });
            toast.success(`Reading session started for "${bookName}"`);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to start session");
        } finally {
            setPending(false);
        }
    }

    async function stopTimer() {
        if (!session || pending) return;

        setPending(true);

        try {
            const bookName = session.book.name;
            await endSession({ bookId: session.bookId, sessionId: session.id });
            setSession(null);
            setSelectedBookId(null);
            toast.success(`Reading session ended for "${bookName}"`);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to end session");
        } finally {
            setPending(false);
        }
    }

    return (
        <>
            <section className="flex flex-1 flex-col">
                <div className="flex flex-1 flex-col items-center justify-center gap-10">
                    <ClockDisplay startedAt={session ? session.startedAt : null} bookName={session ? session.book.name : null} />
                    {session ? <StartButton type="stop" disabled={pending} onClick={stopTimer} /> : <StartButton type="start" disabled={!canStart} onClick={startTimer} />}
                </div>
            </section>

            <Sidebar books={books} sessions={sessions} activeSession={session} selectedBookId={selectedBookId} onSelectBook={session ? () => {} : setSelectedBookId} />
        </>
    );
}
