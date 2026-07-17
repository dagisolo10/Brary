import { BookCard } from "@/components/book-card";
import { NewBookDialog } from "@/components/new-book-dialog";
import { getBooks } from "@/server/book";
import { Inbox } from "lucide-react";

export default async function BooksPage() {
    const books = await getBooks();

    return (
        <div className="flex min-h-screen w-full flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-primary font-mono text-[10px] tracking-widest uppercase">Console / Library</span>
                    <h1 className="text-3xl font-extrabold tracking-tight">Your Books</h1>
                    <p className="text-muted-foreground text-sm">Manage your tracking catalog and configure your library entries.</p>
                </div>

                <NewBookDialog />
            </div>

            {books.length === 0 ? (
                <div className="border-border flex flex-1 flex-col items-center justify-center rounded-2xl border p-16 text-center">
                    <div className="border-border bg-foreground/5 text-muted-foreground mb-4 flex size-12 items-center justify-center rounded-xl border">
                        <Inbox className="size-5" />
                    </div>
                    <h3 className="text-sm font-semibold">No books found</h3>
                    <p className="text-muted-foreground mt-1 max-w-xs text-xs">Add a book to your collection to begin tracking.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
}
