"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { getSessionsWithBooks } from "@/server/session";
import { BookOpenIcon, ClockIcon } from "lucide-react";
import { useState } from "react";
import { NewBookDialog } from "./new-book-dialog";
import { Button } from "./ui/button";

type Book = { id: string; name: string };
type Session = Awaited<ReturnType<typeof getSessionsWithBooks>>[number];
type ActiveSession = { id: string; bookId: string; startedAt: Date; book: { id: string; name: string } } | null;

function formatDuration(ms: number) {
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

function formatDateTime(date: Date) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" });
}

function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function sessionLabel(session: Session) {
    const started = new Date(session.startedAt);

    if (session.endsAt) {
        const ended = new Date(session.endsAt);
        const duration = ended.getTime() - started.getTime();

        return `${formatDuration(duration)} \u00B7 ${formatDateTime(started)}`;
    }

    return `Active \u00B7 Started ${formatTime(started)}`;
}

type SidebarProps = {
    books: Book[];
    activeSession: ActiveSession;
    sessions: Session[];
    selectedBookId: string | null;
    onSelectBook: (id: string | null) => void;
};

export function Sidebar({ books, activeSession, sessions, selectedBookId, onSelectBook }: SidebarProps) {
    const [accordionValue, setAccordionValue] = useState<string[]>([]);

    return (
        // Explicitly bounding the aside element so it stays on screen
        <aside className="flex h-full w-80 overflow-hidden">
            <Accordion value={accordionValue} onValueChange={setAccordionValue} className="w-full flex-1">
                <AccordionItem value="books">
                    <AccordionTrigger onClick={() => setAccordionValue(accordionValue[0] === "books" ? [] : ["books"])}>
                        <div className="flex items-center gap-2">
                            <BookOpenIcon className="size-4" />
                            <span>Books</span>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent>
                        <NewBookDialog />

                        {books.length === 0 ? (
                            <p className="text-muted-foreground py-4 text-center text-sm">No books yet.</p>
                        ) : (
                            <div className="[scrollbar-color:--theme(--color-muted-foreground/40%)_transparent] dark:[scrollbar-color:--theme(--color-muted-foreground/30%)_--theme(--color-muted/20%)] mt-3 flex max-h-[calc(100vh-260px)] [scrollbar-width:thin] flex-col gap-3 overflow-y-auto pr-1">
                                {books.map((book) => (
                                    <Button
                                        key={book.id}
                                        type="button"
                                        variant={selectedBookId === book.id ? "default" : "outline"}
                                        onClick={() => onSelectBook(selectedBookId === book.id ? null : book.id)}
                                        className={cn("flex w-full shrink-0 justify-start gap-2 px-2.5 py-2 text-left")}
                                    >
                                        <BookOpenIcon className="size-3.5 shrink-0" />
                                        <span className="truncate">{book.name}</span>
                                    </Button>
                                ))}
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sessions">
                    <AccordionTrigger onClick={() => setAccordionValue(accordionValue[0] === "sessions" ? [] : ["sessions"])}>
                        <div className="flex items-center gap-2">
                            <ClockIcon className="size-4" />
                            <span>Sessions</span>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent>
                        {sessions.length === 0 ? (
                            <p className="text-muted-foreground py-4 text-center text-sm">No sessions yet.</p>
                        ) : (
                            <div className="[scrollbar-color:--theme(--color-muted-foreground/40%)_transparent] dark:[scrollbar-color:--theme(--color-muted-foreground/30%)_--theme(--color-muted/20%)] flex max-h-[calc(100vh-240px)] [scrollbar-width:thin] flex-col gap-3 overflow-y-auto pr-1">
                                {sessions.slice(0, 20).map((session) => (
                                    <div
                                        key={session.id}
                                        className={cn("flex shrink-0 flex-col gap-0.5 rounded-md px-2.5 py-2 text-sm", activeSession && session.id === activeSession.id ? "bg-primary/15" : "")}
                                    >
                                        <span className="truncate font-medium">{session.book.name}</span>
                                        <span className="text-muted-foreground text-xs">{sessionLabel(session)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    );
}

// "use client";

// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { cn } from "@/lib/utils";
// import { getSessionsWithBooks } from "@/server/session";
// import { BookOpenIcon, ClockIcon } from "lucide-react";
// import { useState } from "react";
// import { NewBookDialog } from "./new-book-dialog";
// import { Button } from "./ui/button";

// type Book = { id: string; name: string };
// type Session = Awaited<ReturnType<typeof getSessionsWithBooks>>[number];
// type ActiveSession = { id: string; bookId: string; startedAt: Date; book: { id: string; name: string } } | null;

// function formatDuration(ms: number) {
//     const totalSeconds = Math.floor(ms / 1000);

//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;

//     if (hours > 0) {
//         return `${hours}h ${minutes}m`;
//     }

//     if (minutes > 0) {
//         return `${minutes}m ${seconds}s`;
//     }

//     return `${seconds}s`;
// }

// function formatDateTime(date: Date) {
//     return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" });
// }

// function formatTime(date: Date) {
//     return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
// }

// function sessionLabel(session: Session) {
//     const started = new Date(session.startedAt);

//     if (session.endsAt) {
//         const ended = new Date(session.endsAt);
//         const duration = ended.getTime() - started.getTime();

//         return `${formatDuration(duration)} \u00B7 ${formatDateTime(started)}`;
//     }

//     return `Active \u00B7 Started ${formatTime(started)}`;
// }

// type SidebarProps = {
//     books: Book[];
//     activeSession: ActiveSession;
//     sessions: Session[];
//     selectedBookId: string | null;
//     onSelectBook: (id: string | null) => void;
// };

// export function Sidebar({ books, activeSession, sessions, selectedBookId, onSelectBook }: SidebarProps) {
//     const [accordionValue, setAccordionValue] = useState<string[]>([]);

//     return (
//         <aside className="w-80 flex-col overflow-hidden border">
//             <Accordion value={accordionValue} onValueChange={setAccordionValue} className="w-full">
//                 <AccordionItem value="books">
//                     <AccordionTrigger onClick={() => setAccordionValue(accordionValue[0] === "books" ? [] : ["books"])}>
//                         <div className="flex items-center gap-2">
//                             <BookOpenIcon className="size-4" />
//                             <span>Books</span>
//                         </div>
//                     </AccordionTrigger>

//                     <AccordionContent>
//                         <NewBookDialog />

//                         {books.length === 0 ? (
//                             <p className="text-muted-foreground py-4 text-center text-sm">No books yet.</p>
//                         ) : (
//                             <div className="mt-3 flex max-h-108 flex-col gap-3 overflow-y-auto">
//                                 {books.map((book) => (
//                                     <Button
//                                         key={book.id}
//                                         type="button"
//                                         variant={selectedBookId === book.id ? "default" : "outline"}
//                                         onClick={() => onSelectBook(selectedBookId === book.id ? null : book.id)}
//                                         className={cn("flex w-full justify-start gap-2 px-2.5 py-2 text-left")}
//                                     >
//                                         <BookOpenIcon className="size-3.5 shrink-0" />
//                                         <span className="truncate">{book.name}</span>
//                                     </Button>
//                                 ))}
//                             </div>
//                         )}
//                     </AccordionContent>
//                 </AccordionItem>

//                 <AccordionItem value="sessions">
//                     <AccordionTrigger onClick={() => setAccordionValue(accordionValue[0] === "sessions" ? [] : ["sessions"])}>
//                         <div className="flex items-center gap-2">
//                             <ClockIcon className="size-4" />
//                             <span>Sessions</span>
//                         </div>
//                     </AccordionTrigger>

//                     <AccordionContent>
//                         {sessions.length === 0 ? (
//                             <p className="text-muted-foreground py-4 text-center text-sm">No sessions yet.</p>
//                         ) : (
//                             <div className="flex flex-col gap-1">
//                                 {sessions.slice(0, 20).map((session) => (
//                                     <div
//                                         key={session.id}
//                                         className={cn("flex flex-col gap-0.5 rounded-md px-2.5 py-2 text-sm", activeSession && session.id === activeSession.id ? "bg-primary/15" : "")}
//                                     >
//                                         <span className="truncate font-medium">{session.book.name}</span>
//                                         <span className="text-muted-foreground text-xs">{sessionLabel(session)}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </AccordionContent>
//                 </AccordionItem>
//             </Accordion>
//         </aside>
//     );
// }
