import { PageClient } from "@/components/page-client";
import { getBooks } from "@/server/book";
import { getActiveSession, getSessionsWithBooks } from "@/server/session";

export default async function Home() {
    const [books, sessions, activeSession] = await Promise.all([getBooks(), getSessionsWithBooks(), getActiveSession()]);

    return (
        <div className="flex flex-1 flex-col">
            <header className="border-border/40 mx-auto flex w-full max-w-6xl items-center border-b px-6 py-4">
                <h1 className="font-heading text-xl font-semibold tracking-tight">Brary</h1>
            </header>

            <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 p-6">
                <PageClient books={books} sessions={sessions} activeSession={activeSession} />
            </div>
        </div>
    );
}
