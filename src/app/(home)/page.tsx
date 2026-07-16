import prisma from "@/lib/prisma";
import { validateUser } from "@/server/auth";
import { Sparkles, Timer } from "lucide-react";
import { getActiveSession } from "@/server/session";
import ReadingDashboardClient from "@/components/reading-page";

export const revalidate = 0;

export default async function HomePage({ searchParams }: { searchParams: Promise<{ bookId?: string }> }) {
    const user = await validateUser();
    const resolvedParams = await searchParams;
    const targetBookId = resolvedParams.bookId;

    const activeSession = await getActiveSession();

    let preparedBook = null;

    if (targetBookId && !activeSession) {
        preparedBook = await prisma.book.findFirst({ where: { id: targetBookId, userId: user.id } });
    }

    return (
        <main className="flex min-h-screen w-full flex-col justify-between gap-6 p-6">
            <div className="flex flex-1 flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-primary font-mono text-[10px] tracking-widest uppercase">Console / Dashboard</span>
                        <h1 className="text-3xl font-extrabold tracking-tight">Reading Dashboard</h1>
                        <p className="text-muted-foreground text-sm">
                            {activeSession
                                ? "You have an active reading session running. Track your focus time below."
                                : preparedBook
                                  ? `You're ready to start reading "${preparedBook.name}".`
                                  : "Select a book from your library to initiate a new tracking session."}
                        </p>
                    </div>

                    {activeSession ? (
                        <div className="flex max-w-fit items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-xs font-semibold text-amber-400">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                                <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
                            </span>
                            <Timer className="size-3.5" />
                            Session Active
                        </div>
                    ) : (
                        <div className="border-border bg-card text-muted-foreground flex max-w-fit items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium">
                            <Sparkles className="size-3.5 text-emerald-500" />
                            Ready to Read
                        </div>
                    )}
                </div>

                <div className="flex flex-1 items-center justify-center">
                    <ReadingDashboardClient activeSession={activeSession} preparedBook={preparedBook} />
                </div>
            </div>

            <footer className="border-border text-muted-foreground border-t pt-6 text-center text-xs">
                <p>© {new Date().getFullYear()} brary. Tracking your focus, one page at a time.</p>
            </footer>
        </main>
    );
}

// import prisma from "@/lib/prisma";
// import { validateUser } from "@/server/auth";
// import { getActiveSession } from "@/server/session";
// import ReadingDashboardClient from "@/components/reading-page";

// export const revalidate = 0;

// export default async function HomePage({ searchParams }: { searchParams: Promise<{ bookId?: string }> }) {
//     const user = await validateUser();
//     const resolvedParams = await searchParams;
//     const targetBookId = resolvedParams.bookId;

//     const activeSession = await getActiveSession();

//     let preparedBook = null;

//     if (targetBookId && !activeSession) {
//         preparedBook = await prisma.book.findFirst({ where: { id: targetBookId, userId: user.id } });
//     }

//     return (
//         <main className="flex h-screen flex-col">
//             <div className="flex flex-1 items-center justify-center">
//                 <ReadingDashboardClient activeSession={activeSession} preparedBook={preparedBook} />
//             </div>

//             <footer className="border-border text-muted-foreground border-t py-6 text-center text-xs">
//                 <p>© {new Date().getFullYear()} brary. Tracking your focus, one page at a time.</p>
//             </footer>
//         </main>
//     );
// }
